import { Module, forwardRef } from '@nestjs/common';
import { DispatchService } from './dispatch.service';
import { DispatchController } from './dispatch.controller';
import { OrdersModule } from '../orders/orders.module';

@Module({
    imports: [forwardRef(() => OrdersModule)],
    controllers: [DispatchController],
    providers: [DispatchService],
    exports: [DispatchService],
})
export class DispatchModule { }
