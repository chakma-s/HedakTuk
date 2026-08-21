import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RedisService } from '../../common/redis/redis.service';

@ApiTags('health')
@SkipThrottle()
@Controller('health')
export class HealthController {
    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Health check — liveness probe' })
    async check() {
        const checks: Record<string, string> = {
            api: 'healthy',
        };

        // Check database connectivity
        try {
            await this.prisma.$queryRaw`SELECT 1`;
            checks.database = 'healthy';
        } catch {
            checks.database = 'unhealthy';
        }

        // Check Redis connectivity
        try {
            await this.redis.getClient().ping();
            checks.redis = 'healthy';
        } catch {
            checks.redis = 'unhealthy';
        }

        const isHealthy = Object.values(checks).every((v) => v === 'healthy');

        return {
            status: isHealthy ? 'healthy' : 'degraded',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            checks,
        };
    }

    @Get('ready')
    @ApiOperation({ summary: 'Readiness probe — is the app ready to serve traffic?' })
    async ready() {
        try {
            await this.prisma.$queryRaw`SELECT 1`;
            await this.redis.getClient().ping();
            return { status: 'ready' };
        } catch {
            return { status: 'not_ready' };
        }
    }
}
