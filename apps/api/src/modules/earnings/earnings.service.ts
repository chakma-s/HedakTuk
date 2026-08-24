import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class EarningsService {
    constructor(private readonly prisma: PrismaService) {}

    async getDriverEarningsSummary(driverId: string) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startOfWeek = new Date();
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const [todayEarning, weekEarning, totalEarning] = await Promise.all([
            this.prisma.driverEarning.aggregate({ where: { driverId, createdAt: { gte: today } }, _sum: { totalEarning: true } }),
            this.prisma.driverEarning.aggregate({ where: { driverId, createdAt: { gte: startOfWeek } }, _sum: { totalEarning: true } }),
            this.prisma.driverEarning.aggregate({ where: { driverId }, _sum: { totalEarning: true } })
        ]);

        return {
            today: todayEarning._sum.totalEarning || 0,
            thisWeek: weekEarning._sum.totalEarning || 0,
            allTime: totalEarning._sum.totalEarning || 0,
        };
    }

    async getDriverEarningsHistory(driverId: string, page: number, limit: number) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.driverEarning.findMany({ where: { driverId }, skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
            this.prisma.driverEarning.count({ where: { driverId } })
        ]);
        return { data, total, page: Number(page), limit: Number(limit) };
    }

    async createEarningRecord(driverId: string, orderId: string, deliveryFee: number, tip: number = 0, bonus: number = 0) {
        return this.prisma.driverEarning.create({
            data: {
                driverId,
                orderId,
                deliveryFee,
                tip,
                bonus,
                totalEarning: deliveryFee + tip + bonus,
            }
        });
    }

    async getAdminPayoutSummary() {
        const pending = await this.prisma.driverEarning.aggregate({ where: { paidOut: false }, _sum: { totalEarning: true } });
        const paid = await this.prisma.driverEarning.aggregate({ where: { paidOut: true }, _sum: { totalEarning: true } });
        
        return {
            pendingPayouts: pending._sum.totalEarning || 0,
            totalPaid: paid._sum.totalEarning || 0,
        };
    }
}
