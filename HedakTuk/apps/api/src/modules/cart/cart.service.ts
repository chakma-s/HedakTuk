import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class CartService {
    constructor(private readonly prisma: PrismaService) { }

    async getCart(userId: string) {
        const cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        menuItem: {
                            select: { id: true, name: true, price: true, imageUrl: true, isVeg: true, isAvailable: true },
                        },
                    },
                },
            },
        });

        if (!cart || cart.items.length === 0) {
            return { items: [], subtotal: 0, deliveryFee: 0, total: 0 };
        }

        const subtotal = cart.items.reduce(
            (sum: number, item: any) => sum + item.menuItem.price * item.quantity, 0,
        );

        // Get restaurant delivery fee
        let deliveryFee = 0;
        if (cart.restaurantId) {
            const restaurant = await this.prisma.restaurant.findUnique({
                where: { id: cart.restaurantId },
                select: { deliveryFee: true },
            });
            deliveryFee = restaurant?.deliveryFee || 0;
        }

        return {
            id: cart.id,
            restaurantId: cart.restaurantId,
            items: cart.items.map((item: any) => ({
                id: item.id,
                menuItemId: item.menuItemId,
                menuItem: item.menuItem,
                quantity: item.quantity,
                totalPrice: item.menuItem.price * item.quantity,
            })),
            subtotal,
            deliveryFee,
            total: subtotal + deliveryFee,
        };
    }

    async addItem(userId: string, menuItemId: string, quantity: number = 1) {
        // Check menu item exists
        const menuItem = await this.prisma.menuItem.findUnique({
            where: { id: menuItemId },
            select: { id: true, restaurantId: true, isAvailable: true },
        });

        if (!menuItem) throw new BadRequestException('Menu item not found');
        if (!menuItem.isAvailable) throw new BadRequestException('Item is not available');

        // Get or create cart
        let cart = await this.prisma.cart.findUnique({ where: { userId } });

        if (cart && cart.restaurantId && cart.restaurantId !== menuItem.restaurantId) {
            // Clear cart if switching restaurants
            await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
            cart = await this.prisma.cart.update({
                where: { userId },
                data: { restaurantId: menuItem.restaurantId },
            });
        }

        if (!cart) {
            cart = await this.prisma.cart.create({
                data: { userId, restaurantId: menuItem.restaurantId },
            });
        }

        // Upsert cart item
        await this.prisma.cartItem.upsert({
            where: { cartId_menuItemId: { cartId: cart.id, menuItemId } },
            create: { cartId: cart.id, menuItemId, quantity },
            update: { quantity: { increment: quantity } },
        });

        return this.getCart(userId);
    }

    async updateItemQuantity(userId: string, cartItemId: string, quantity: number) {
        if (quantity <= 0) {
            return this.removeItem(userId, cartItemId);
        }

        await this.prisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity },
        });

        return this.getCart(userId);
    }

    async removeItem(userId: string, cartItemId: string) {
        await this.prisma.cartItem.delete({ where: { id: cartItemId } });
        return this.getCart(userId);
    }

    async clearCart(userId: string) {
        const cart = await this.prisma.cart.findUnique({ where: { userId } });
        if (cart) {
            await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
        }
        return { items: [], subtotal: 0, deliveryFee: 0, total: 0 };
    }
}
