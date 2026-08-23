import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const logger = new Logger('Bootstrap');

    // Security
    app.use(helmet());
    app.enableCors({
        origin: [
            process.env.ADMIN_URL || 'http://localhost:3001',
            process.env.RESTAURANT_URL || 'http://localhost:3002',
            process.env.MOBILE_API_URL || 'http://localhost:3000',
            'http://localhost:8081',
            'http://localhost:8082',
            'http://localhost:3333',
            '*',
        ],
        credentials: true,
    });

    // Global Filters
    app.useGlobalFilters(new AllExceptionsFilter());

    // Global Pipes
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        }),
    );

    // API Prefix
    app.setGlobalPrefix('api/v1');

    // Swagger Documentation
    const config = new DocumentBuilder()
        .setTitle('HedakTuk API')
        .setDescription('API for HedakTuk App — Food Delivery Platform')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('health', 'Health Check & Readiness')
        .addTag('auth', 'Authentication & Authorization')
        .addTag('users', 'User Profile & Addresses')
        .addTag('restaurants', 'Restaurant Discovery & Details')
        .addTag('menu', 'Menu Categories & Items')
        .addTag('cart', 'Shopping Cart')
        .addTag('orders', 'Order Management')
        .addTag('payments', 'Payment Processing')
        .addTag('admin', 'Admin Operations')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    // Start
    const port = process.env.PORT || 3333;
    await app.listen(port);
    logger.log(`🚀 API running on http://localhost:${port}`);
    logger.log(`📖 Swagger docs at http://localhost:${port}/api/docs`);
    logger.log(`💚 Health check at http://localhost:${port}/api/v1/health`);
}

bootstrap();
