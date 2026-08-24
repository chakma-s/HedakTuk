import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './common/prisma/prisma.module';
import { RedisModule } from './common/redis/redis.module';
import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';
import { MenuModule } from './modules/menu/menu.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { HealthModule } from './modules/health/health.module';
import { DispatchModule } from './modules/dispatch/dispatch.module';
import { EarningsModule } from './modules/earnings/earnings.module';

@Module({
    imports: [
        // Global config — loads .env
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '../../.env',
        }),

        // Global rate limiting — 60 requests per minute per IP
        ThrottlerModule.forRoot([{
            ttl: 60000,
            limit: 60,
        }]),

        // Core services
        PrismaModule,
        RedisModule,
        BullModule.forRoot({ connection: { host: 'localhost', port: 6379, password: 'redis_dev_2026' } }),

        // Feature modules
        AuthModule,
        UsersModule,
        RestaurantsModule,
        MenuModule,
        CartModule,
        OrdersModule,
        PaymentsModule,
        NotificationsModule,
        HealthModule,
        DispatchModule,
        EarningsModule,
    ],
    providers: [
        // Apply rate limiting globally
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule { }
