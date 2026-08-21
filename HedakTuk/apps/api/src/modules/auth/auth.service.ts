import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RedisService } from '../../common/redis/redis.service';
import { LoginResponse } from '@hedaktuk/shared-types';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
        private readonly redis: RedisService,
    ) { }

    // ---- OTP Login ----

    async sendOtp(phone: string): Promise<{ message: string }> {
        // Rate limit: max 5 OTP requests per phone per 10 minutes
        const rateLimitKey = `otp_rate:${phone}`;
        const attempts = await this.redis.incrementRateLimit(rateLimitKey, 600);
        if (attempts > 5) {
            throw new BadRequestException('Too many OTP requests. Try again later.');
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await this.redis.setOtp(phone, otp);

        // TODO: Send OTP via SMS provider (MSG91/Twilio)
        // For development, log the OTP
        console.log(`📱 OTP for ${phone}: ${otp}`);

        return { message: 'OTP sent successfully' };
    }

    async verifyOtp(phone: string, otp: string): Promise<LoginResponse> {
        const storedOtp = await this.redis.getOtp(phone);

        if (!storedOtp || storedOtp !== otp) {
            throw new UnauthorizedException('Invalid or expired OTP');
        }

        await this.redis.deleteOtp(phone);

        // Find or create user
        let user = await this.prisma.user.findUnique({ where: { phone } });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    name: '',
                    phone,
                    role: 'CUSTOMER',
                },
            });
        }

        return this.generateTokens(user);
    }

    // ---- Email/Password Auth ----

    async register(name: string, email: string, phone: string, password: string): Promise<LoginResponse> {
        const existingUser = await this.prisma.user.findFirst({
            where: { OR: [{ email }, { phone }] },
        });

        if (existingUser) {
            throw new ConflictException('User with this email or phone already exists');
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await this.prisma.user.create({
            data: { name, email, phone, passwordHash, role: 'CUSTOMER' },
        });

        return this.generateTokens(user);
    }

    async login(email: string, password: string): Promise<LoginResponse> {
        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user || !user.passwordHash) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('Account is deactivated');
        }

        return this.generateTokens(user);
    }

    // ---- Token Helpers ----

    private async generateTokens(user: any): Promise<LoginResponse> {
        const payload = { sub: user.id, role: user.role };

        const accessToken = this.jwt.sign(payload);
        const refreshToken = this.jwt.sign(payload, {
            secret: this.config.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
        });

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                avatarUrl: user.avatarUrl,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
            },
        };
    }

    async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
        try {
            const payload = this.jwt.verify(refreshToken, {
                secret: this.config.get<string>('JWT_REFRESH_SECRET'),
            });

            const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
            if (!user || !user.isActive) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            const accessToken = this.jwt.sign({ sub: user.id, role: user.role });
            return { accessToken };
        } catch {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }
}
