import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class MenuService {
    constructor(private readonly prisma: PrismaService) { }

    // ---- Categories ----

    async getCategories(restaurantId: string) {
        return this.prisma.menuCategory.findMany({
            where: { restaurantId },
            orderBy: { sortOrder: 'asc' },
            include: { items: { orderBy: { name: 'asc' } } },
        });
    }

    async createCategory(restaurantId: string, data: { name: string; sortOrder?: number }) {
        return this.prisma.menuCategory.create({
            data: { ...data, restaurantId },
        });
    }

    async updateCategory(id: string, data: { name?: string; sortOrder?: number }) {
        return this.prisma.menuCategory.update({ where: { id }, data });
    }

    async deleteCategory(id: string) {
        return this.prisma.menuCategory.delete({ where: { id } });
    }

    // ---- Menu Items ----

    async getItems(restaurantId: string, categoryId?: string) {
        const where: any = { restaurantId };
        if (categoryId) where.categoryId = categoryId;

        return this.prisma.menuItem.findMany({
            where,
            orderBy: { name: 'asc' },
            include: { category: { select: { name: true } } },
        });
    }

    async createItem(restaurantId: string, data: any) {
        return this.prisma.menuItem.create({
            data: { ...data, restaurantId },
        });
    }

    async updateItem(id: string, data: any) {
        return this.prisma.menuItem.update({ where: { id }, data });
    }

    async deleteItem(id: string) {
        return this.prisma.menuItem.delete({ where: { id } });
    }

    async toggleAvailability(id: string, isAvailable: boolean) {
        return this.prisma.menuItem.update({
            where: { id },
            data: { isAvailable },
        });
    }
}
