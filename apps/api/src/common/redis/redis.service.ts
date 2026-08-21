import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
    private readonly client: Redis;

    constructor(private readonly configService: ConfigService) {
        this.client = new Redis({
            host: this.configService.get<string>('REDIS_HOST', 'localhost'),
            port: this.configService.get<number>('REDIS_PORT', 6379),
            password: this.configService.get<string>('REDIS_PASSWORD', ''),
        });

        this.client.on('connect', () => console.log('✅ Redis connected'));
        this.client.on('error', (err) => console.error('❌ Redis error:', err.message));
    }

    getClient(): Redis {
        return this.client;
    }

    // ---- Common Operations ----

    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
        if (ttlSeconds) {
            await this.client.set(key, value, 'EX', ttlSeconds);
        } else {
            await this.client.set(key, value);
        }
    }

    async del(key: string): Promise<void> {
        await this.client.del(key);
    }

    async exists(key: string): Promise<boolean> {
        const result = await this.client.exists(key);
        return result === 1;
    }

    // ---- OTP Helpers ----

    async setOtp(phone: string, otp: string): Promise<void> {
        await this.set(`otp:${phone}`, otp, 300); // 5 min TTL
    }

    async getOtp(phone: string): Promise<string | null> {
        return this.get(`otp:${phone}`);
    }

    async deleteOtp(phone: string): Promise<void> {
        await this.del(`otp:${phone}`);
    }

    // ---- Rate Limiting ----

    async incrementRateLimit(key: string, windowSeconds: number): Promise<number> {
        const multi = this.client.multi();
        multi.incr(key);
        multi.expire(key, windowSeconds);
        const results = await multi.exec();
        return results?.[0]?.[1] as number;
    }

    async onModuleDestroy() {
        await this.client.quit();
    }
}
