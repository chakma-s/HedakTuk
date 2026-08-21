import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { OrdersGateway } from './orders.gateway';
import { OrderStatus } from '@hedaktuk/shared-types';

@Injectable()
export class OrdersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly ordersGateway: OrdersGateway,
    ) { }

    async placeOrder(userId: string, data: {
        addressId?: string;
        deliveryAddress?: any; // Allow passing raw address for MVP
        restaurantId: string;
        items: any[];
        couponCode?: string;
        specialInstructions?: string;
        paymentMethod: string;
    }) {
        if (!data.items || data.items.length === 0) {
            throw new BadRequestException('Cart is empty');
        }

        // Calculate totals
        const subtotal = data.items.reduce(
            (sum: number, item: any) => sum + item.unitPrice * item.quantity, 0,
        );

        const restaurant = await this.prisma.restaurant.findUnique({
            where: { id: data.restaurantId },
            select: { deliveryFee: true, minOrderAmount: true },
        });

        if (subtotal < (restaurant?.minOrderAmount || 0)) {
            throw new BadRequestException(`Minimum order amount is ₹${restaurant?.minOrderAmount}`);
        }

        const deliveryFee = restaurant?.deliveryFee || 0;

        // Apply coupon (if any)
        let discount = 0;
        if (data.couponCode) {
            const coupon = await this.prisma.coupon.findUnique({
                where: { code: data.couponCode },
            });

            if (coupon && coupon.isActive && new Date() <= coupon.validUntil && subtotal >= coupon.minOrderAmount) {
                if (coupon.discountType === 'PERCENTAGE') {
                    discount = (subtotal * coupon.discountValue) / 100;
                    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                        discount = coupon.maxDiscount;
                    }
                } else {
                    discount = coupon.discountValue;
                }
                // Increment usage
                await this.prisma.coupon.update({
                    where: { id: coupon.id },
                    data: { usedCount: { increment: 1 } },
                });
            }
        }

        const total = subtotal + deliveryFee - discount;
        const addressJson = data.deliveryAddress || { label: 'Home', fullAddress: 'Dummy Address', latitude: 0, longitude: 0 };

        // Create order + items in transaction
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
                    estimatedDeliveryMinutes: 30,
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

            // Create payment record
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

        // Notify restaurant via WebSocket
        // this.ordersGateway.notifyNewOrder(order.restaurantId, order);

        return order;
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
                where: { userId },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    items: true,
                    payment: { select: { method: true, status: true } },
                },
            }),
            this.prisma.order.count({ where: { userId } }),
        ]);

        return {
            data: orders,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }

    async updateStatus(orderId: string, status: OrderStatus) {
        const order = await this.prisma.order.update({
            where: { id: orderId },
            data: {
                status,
                ...(status === 'DELIVERED' ? { deliveredAt: new Date() } : {}),
            },
        });

        // Notify customer via WebSocket
        this.ordersGateway.notifyOrderStatusUpdate(orderId, status);

        return order;
    }

    async cancelOrder(orderId: string, userId: string) {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order) throw new NotFoundException('Order not found');
        if (order.userId !== userId) throw new ForbiddenException();
        if (!['PLACED', 'CONFIRMED'].includes(order.status)) {
            throw new BadRequestException('Order cannot be cancelled at this stage');
        }

        return this.updateStatus(orderId, OrderStatus.CANCELLED);
    }

    async getRestaurantOrders(restaurantId: string, status?: string, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const where = { restaurantId, ...(status ? { status: status as any } : {}) };

        const [data, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                include: { items: true, payment: { select: { method: true, status: true } }, user: { select: { name: true, phone: true } } },
                orderBy: { createdAt: 'desc' },
                skip,
                take: Number(limit),
            }),
            this.prisma.order.count({ where }),
        ]);

        return { data, total, page: Number(page), limit: Number(limit) };
    }

    async getPendingDeliveries(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const where = { status: 'READY' as any }; // Delivery partners see READY orders

        const [data, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                include: {
                    items: true,
                    restaurant: { select: { name: true, address: true, latitude: true, longitude: true } },
                    user: { select: { name: true, phone: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: Number(limit),
            }),
            this.prisma.order.count({ where }),
        ]);

        return { data, total, page: Number(page), limit: Number(limit) };
    }

    async getAdminStats() {
        const [totalOrders, totalRevenue, totalUsers, totalRestaurants] = await Promise.all([
            this.prisma.order.count(),
            this.prisma.order.aggregate({ _sum: { total: true }, where: { status: 'DELIVERED' } }),
            this.prisma.user.count(),
            this.prisma.restaurant.count(),
        ]);

        return {
            totalOrders,
            totalRevenue: totalRevenue._sum.total || 0,
            totalUsers,
            totalRestaurants,
        };
    }
}
