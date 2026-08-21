import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './common/prisma/prisma.module';
import { RedisModule } from './common/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';
import { MenuModule } from './modules/menu/menu.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { HealthModule } from './modules/health/health.module';

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
