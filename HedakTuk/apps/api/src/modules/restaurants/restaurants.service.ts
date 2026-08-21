import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

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
        const { page = 1, limit = 20, search, cuisine } = params;
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

        // TODO: Add PostGIS-based geospatial filtering for distance queries
        // For now, return all matching restaurants sorted by rating

        const [restaurants, total] = await Promise.all([
            this.prisma.restaurant.findMany({
                where,
                skip,
                take: limit,
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

        return {
            data: restaurants,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
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
}
