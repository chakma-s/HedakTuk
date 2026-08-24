import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

function calculateHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(1));
}

@Injectable()
export class RestaurantsService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(params: {
        latitude?: number;
        longitude?: number;
        radiusKm?: number;
        cuisine?: string;
        search?: string;
        isVegOnly?: boolean;
        page?: number;
        limit?: number;
    }) {
        const { page = 1, limit = 20, search, cuisine, latitude, longitude, radiusKm = 15 } = params;
        const skip = (page - 1) * limit;

        const where: any = { isActive: true };

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { cuisines: { hasSome: [search] } },
            ];
        }

        if (cuisine) {
            where.cuisines = { hasSome: [cuisine] };
        }

        const [restaurants, total] = await Promise.all([
            this.prisma.restaurant.findMany({
                where,
                orderBy: { rating: 'desc' },
                select: {
                    id: true, name: true, description: true, coverImageUrl: true, logoUrl: true,
                    address: true, latitude: true, longitude: true, rating: true, totalRatings: true,
                    cuisines: true, avgDeliveryTimeMinutes: true, minOrderAmount: true, deliveryFee: true,
                    isOpen: true,
                },
            }),
            this.prisma.restaurant.count({ where }),
        ]);

        let results: any[] = restaurants;

        if (latitude !== undefined && longitude !== undefined) {
            results = restaurants
                .map((r: any) => {
                    const distanceKm = calculateHaversineDistanceKm(
                        Number(latitude),
                        Number(longitude),
                        r.latitude,
                        r.longitude,
                    );
                    return { ...r, distanceKm };
                })
                .filter((r: any) => r.distanceKm <= Number(radiusKm))
                .sort((a: any, b: any) => a.distanceKm - b.distanceKm);
        }

        const paginated = results.slice(skip, skip + Number(limit));

        return {
            data: paginated,
            meta: { total: results.length, page: Number(page), limit: Number(limit), totalPages: Math.ceil(results.length / Number(limit)) },
        };
    }

    async findById(id: string) {
        return this.prisma.restaurant.findUnique({
            where: { id },
            include: {
                categories: {
                    orderBy: { sortOrder: 'asc' },
                    include: {
                        items: { where: { isAvailable: true }, orderBy: { name: 'asc' } },
                    },
                },
            },
        });
    }

    async create(ownerId: string, data: any) {
        return this.prisma.restaurant.create({ data: { ...data, ownerId } });
    }

    async update(id: string, ownerId: string, data: any) {
        return this.prisma.restaurant.updateMany({
            where: { id, ownerId },
            data,
        });
    }

    async toggleOpen(id: string, ownerId: string, isOpen: boolean) {
        return this.prisma.restaurant.updateMany({
            where: { id, ownerId },
            data: { isOpen },
        });
    }

    // ---- Admin Operations ----

    async findAllAdmin(params: { search?: string; page?: number; limit?: number }) {
        const { page = 1, limit = 20, search } = params;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { address: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [restaurants, total] = await Promise.all([
            this.prisma.restaurant.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { createdAt: 'desc' },
                include: {
                    owner: { select: { id: true, name: true, phone: true, email: true } },
                    _count: { select: { orders: true, menuItems: true } },
                },
            }),
            this.prisma.restaurant.count({ where }),
        ]);

        return {
            data: restaurants,
            meta: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
        };
    }

    async updateStatus(id: string, isActive: boolean) {
        return this.prisma.restaurant.update({
            where: { id },
            data: { isActive },
        });
    }

    async updateCommissionRate(id: string, commissionRate: number) {
        return this.prisma.restaurant.update({
            where: { id },
            data: { commissionRate },
        });
    }
}
