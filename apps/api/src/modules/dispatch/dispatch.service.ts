import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { RedisService } from '../../common/redis/redis.service';
import { OrdersGateway } from '../orders/orders.gateway';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class DispatchService {
    constructor(
        private readonly redisService: RedisService,
        private readonly ordersGateway: OrdersGateway,
        @Inject(forwardRef(() => OrdersService))
        private readonly ordersService: OrdersService,
    ) {}

    async registerDriverOnline(driverId: string, lat: number, lng: number) {
        const client = this.redisService.getClient();
        await client.geoadd('drivers:online', lng, lat, driverId);
    }

    async registerDriverOffline(driverId: string) {
        const client = this.redisService.getClient();
        await client.zrem('drivers:online', driverId);
    }

    async updateDriverLocation(driverId: string, lat: number, lng: number) {
        const client = this.redisService.getClient();
        await client.geoadd('drivers:online', lng, lat, driverId);
    }

    async dispatchOrder(orderId: string, restaurantLat: number, restaurantLng: number) {
        const client = this.redisService.getClient();
        // find drivers within 5km
        const nearbyDrivers = await client.georadius(
            'drivers:online',
            restaurantLng,
            restaurantLat,
            5,
            'km',
            'WITHDIST',
            'ASC'
        );
        
        if (nearbyDrivers && nearbyDrivers.length > 0) {
            const nearestDriver = (nearbyDrivers as any[])[0][0] as string;
            // Notify specific driver via websocket
            this.ordersGateway.server.to(`driver:${nearestDriver}`).emit('dispatch_request', { orderId });
        }
    }

    async handleDriverAccept(orderId: string, driverId: string) {
        await this.ordersService.acceptDeliveryOrder(orderId, driverId);
    }

    async handleDriverReject(orderId: string, driverId: string) {
        // In a full implementation, we would skip this driver and try the next nearest
    }
}
