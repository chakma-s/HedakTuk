import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SendOtpDto, VerifyOtpDto, RegisterDto, LoginDto, RefreshTokenDto } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('send-otp')
    @ApiOperation({ summary: 'Send OTP to phone number' })
    sendOtp(@Body() dto: SendOtpDto) {
        return this.authService.sendOtp(dto.phone);
    }

    @Post('verify-otp')
    @ApiOperation({ summary: 'Verify OTP and get tokens' })
    verifyOtp(@Body() dto: VerifyOtpDto) {
        return this.authService.verifyOtp(dto.phone, dto.otp);
    }

    @Post('register')
    @ApiOperation({ summary: 'Register with email and password' })
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto.name, dto.email, dto.phone, dto.password);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login with email and password' })
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto.email, dto.password);
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Refresh access token' })
    refresh(@Body() dto: RefreshTokenDto) {
        return this.authService.refreshAccessToken(dto.refreshToken);
    }
}
