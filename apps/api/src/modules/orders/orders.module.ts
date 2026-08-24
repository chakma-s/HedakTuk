import { Module, forwardRef } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersGateway } from './orders.gateway';
import { BullModule } from '@nestjs/bullmq';
import { OrderTimeoutProcessor } from './order-timeout.processor';
import { DispatchModule } from '../dispatch/dispatch.module';
import { EarningsModule } from '../earnings/earnings.module';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'order-timeout',
        }),
        forwardRef(() => DispatchModule),
        EarningsModule,
    ],
    controllers: [OrdersController],
    providers: [OrdersService, OrdersGateway, OrderTimeoutProcessor],
    exports: [OrdersService, OrdersGateway],
})
export class OrdersModule { }
