import { IsString, IsNotEmpty, IsEmail, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
    @ApiProperty({ example: '+919876543210' })
    @IsString()
    @IsNotEmpty()
    @Matches(/^\+[1-9]\d{9,14}$/, { message: 'Phone must be in international format (e.g., +919876543210)' })
    phone: string;
}

export class VerifyOtpDto {
    @ApiProperty({ example: '+919876543210' })
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({ example: '123456' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(6)
    otp: string;
}

export class RegisterDto {
    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @ApiProperty({ example: 'john@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '+919876543210' })
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({ example: 'StrongP@ss123' })
    @IsString()
    @MinLength(8)
    @MaxLength(100)
    password: string;
}

export class LoginDto {
    @ApiProperty({ example: 'john@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'StrongP@ss123' })
    @IsString()
    @IsNotEmpty()
    password: string;
}

export class RefreshTokenDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}
