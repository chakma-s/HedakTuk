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
}
