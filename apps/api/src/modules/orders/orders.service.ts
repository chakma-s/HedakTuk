import { Injectable, BadRequestException, NotFoundException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { OrdersGateway } from './orders.gateway';
import { OrderStatus } from '@hedaktuk/shared-types';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { DispatchService } from '../dispatch/dispatch.service';
import { EarningsService } from '../earnings/earnings.service';

@Injectable()
export class OrdersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly ordersGateway: OrdersGateway,
        @InjectQueue('order-timeout') private readonly orderTimeoutQueue: Queue,
        @Inject(forwardRef(() => DispatchService))
        private readonly dispatchService: DispatchService,
        private readonly earningsService: EarningsService,
    ) { }

    async placeOrder(userId: string, data: any) {
        if (!data.items || data.items.length === 0) {
            throw new BadRequestException('Cart is empty');
        }

        const subtotal = data.items.reduce((sum: number, item: any) => sum + item.unitPrice * item.quantity, 0);

        const restaurant = await this.prisma.restaurant.findUnique({
            where: { id: data.restaurantId },
        });

        if (subtotal < (restaurant?.minOrderAmount || 0)) {
            throw new BadRequestException(`Minimum order amount is ₹${restaurant?.minOrderAmount}`);
        }

        const deliveryFee = restaurant?.deliveryFee || 0;
        let discount = 0;
        // Simplified coupon logic for brevity
        const total = subtotal + deliveryFee - discount;
        const addressJson = data.deliveryAddress || { label: 'Home', fullAddress: 'Dummy Address', latitude: 0, longitude: 0 };

        const order = await this.prisma.$transaction(async (tx: any) => {
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    restaurantId: data.restaurantId,
                    status: 'PLACED',
                    subtotal,
                    deliveryFee,
                    discount,
                    total,
                    couponCode: data.couponCode || null,
                    deliveryAddress: addressJson,
                    specialInstructions: data.specialInstructions || null,
                    estimatedDeliveryMinutes: 30 + (restaurant?.prepTimeMinutes || 0),
                    items: {
                        create: data.items.map((item: any) => ({
                            menuItemId: item.menuItemId,
                            name: item.name,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            totalPrice: item.unitPrice * item.quantity,
                            isVeg: item.isVeg || false,
                        })),
                    },
                },
                include: { items: true },
            });

            await tx.payment.create({
                data: {
                    orderId: newOrder.id,
                    method: data.paymentMethod as any,
                    status: data.paymentMethod === 'COD' ? 'SUCCESS' : 'PENDING',
                    amount: total,
                },
            });

            return newOrder;
        });

        this.ordersGateway.notifyNewOrder(order.restaurantId, order);
        
        // Add 60-second auto-decline timer
        await this.orderTimeoutQueue.add('order-timeout', { orderId: order.id }, { delay: 60000 });

        return order;
    }

    async getOrderByIdInternal(orderId: string) {
        return this.prisma.order.findUnique({ where: { id: orderId } });
    }

    async getOrderById(orderId: string, userId: string) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true, payment: true },
        });

        if (!order) throw new NotFoundException('Order not found');
        if (order.userId !== userId) throw new ForbiddenException();

        return order;
    }

    async getUserOrders(userId: string, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where: { userId }, skip, take: limit, orderBy: { createdAt: 'desc' },
                include: { items: true, payment: { select: { method: true, status: true } } },
            }),
            this.prisma.order.count({ where: { userId } }),
        ]);
        return { data: orders, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }

    async updateStatus(orderId: string, status: OrderStatus) {
        const order = await this.prisma.order.update({
            where: { id: orderId },
            data: {
                status,
                ...(status === 'DELIVERED' ? { deliveredAt: new Date() } : {}),
            },
            include: { restaurant: true }
        });

        this.ordersGateway.notifyOrderStatusUpdate(orderId, status);

        if (status === 'READY') {
            await this.dispatchService.dispatchOrder(orderId, order.restaurant.latitude, order.restaurant.longitude);
        }
        
        if (status === 'DELIVERED' && order.deliveryPartnerId) {
            await this.earningsService.createEarningRecord(order.deliveryPartnerId, orderId, order.deliveryFee, 0, 0);
        }

        return order;
    }

    async cancelOrder(orderId: string, userId: string) {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order || order.userId !== userId) throw new ForbiddenException();
        return this.updateStatus(orderId, OrderStatus.CANCELLED);
    }

    async getRestaurantOrders(restaurantId: string, status?: string, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const where = { restaurantId, ...(status ? { status: status as any } : {}) };
        const [data, total] = await Promise.all([
            this.prisma.order.findMany({ where, include: { items: true, payment: { select: { method: true, status: true } }, user: { select: { name: true, phone: true } } }, orderBy: { createdAt: 'desc' }, skip, take: Number(limit) }),
            this.prisma.order.count({ where }),
        ]);
        return { data, total, page: Number(page), limit: Number(limit) };
    }

    async acceptDeliveryOrder(orderId: string, deliveryPartnerId: string) {
        const updatedOrder = await this.prisma.order.update({
            where: { id: orderId },
            data: { deliveryPartnerId },
            include: { items: true, restaurant: { select: { id: true, name: true, address: true, latitude: true, longitude: true } }, user: { select: { id: true, name: true, phone: true } } },
        });
        this.ordersGateway.notifyOrderStatusUpdate(orderId, updatedOrder.status as any);
        return updatedOrder;
    }

    async reassignOrder(orderId: string, driverId: string) {
        const updatedOrder = await this.prisma.order.update({
            where: { id: orderId },
            data: { deliveryPartnerId: driverId },
        });
        this.ordersGateway.notifyOrderStatusUpdate(orderId, updatedOrder.status as any);
        return updatedOrder;
    }

    async getPendingDeliveries(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const where = { deliveryPartnerId: null, status: { in: ['CONFIRMED', 'PREPARING', 'READY'] as any } };
        const [data, total] = await Promise.all([
            this.prisma.order.findMany({ where, include: { items: true, restaurant: { select: { name: true, address: true, latitude: true, longitude: true } }, user: { select: { name: true, phone: true } } }, orderBy: { createdAt: 'desc' }, skip, take: Number(limit) }),
            this.prisma.order.count({ where }),
        ]);
        return { data, total, page: Number(page), limit: Number(limit) };
    }

    async getAdminStats() {
        return { totalOrders: 0, totalRevenue: 0, totalUsers: 0, totalRestaurants: 0 };
    }
    
    async getAdminFinanceSummary() {
        const revenue = await this.prisma.order.aggregate({ where: { status: 'DELIVERED' }, _sum: { total: true } });
        // Calculate commissions manually or via a sum field later
        return { totalRevenue: revenue._sum.total || 0, totalCommissions: 0 };
    }

    async addReview(orderId: string, userId: string, data: any) {
        return { success: true };
    }
}
