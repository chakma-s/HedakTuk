import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async getProfile(userId: string) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true, name: true, email: true, phone: true,
                avatarUrl: true, role: true, isActive: true,
                createdAt: true, updatedAt: true,
            },
        });
    }

    async updateProfile(userId: string, data: { name?: string; email?: string; avatarUrl?: string }) {
        return this.prisma.user.update({ where: { id: userId }, data });
    }

    async getAddresses(userId: string) {
        return this.prisma.address.findMany({ where: { userId }, orderBy: { isDefault: 'desc' } });
    }

    async addAddress(userId: string, data: any) {
        return this.prisma.address.create({ data: { ...data, userId } });
    }

    async deleteAddress(userId: string, addressId: string) {
        return this.prisma.address.deleteMany({ where: { id: addressId, userId } });
    }

    // ---- Admin Operations ----

    async getAllUsers(params: { search?: string; role?: string; page?: number; limit?: number }) {
        const { page = 1, limit = 20, search, role } = params;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (role && role !== 'all') {
            where.role = role as any;
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                    _count: { select: { orders: true } },
                },
            }),
            this.prisma.user.count({ where }),
        ]);

        return {
            data: users,
            meta: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
        };
    }

    async updateUserRole(userId: string, role: any) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { role },
            select: { id: true, name: true, role: true, isActive: true },
        });
    }

    async updateUserStatus(userId: string, isActive: boolean) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { isActive },
            select: { id: true, name: true, role: true, isActive: true },
        });
    }
}
