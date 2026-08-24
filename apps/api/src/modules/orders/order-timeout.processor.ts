import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { OrdersService } from './orders.service';
import { Inject, forwardRef } from '@nestjs/common';
import { OrderStatus } from '@hedaktuk/shared-types';

@Processor('order-timeout')
export class OrderTimeoutProcessor extends WorkerHost {
    constructor(
        @Inject(forwardRef(() => OrdersService))
        private readonly ordersService: OrdersService,
    ) {
        super();
    }

    async process(job: Job<any, any, string>): Promise<any> {
        const { orderId } = job.data;
        
        try {
            const order = await this.ordersService.getOrderByIdInternal(orderId);
            
            if (order && order.status === 'PLACED') {
                console.log(`Auto-declining order ${orderId} due to timeout`);
                // Use the new cancelOrder method or updateStatus directly for auto-cancellation
                await this.ordersService.updateStatus(orderId, OrderStatus.CANCELLED);
                
                // Note: Real refund logic would go here
            }
        } catch (error) {
            console.error(`Failed to process order timeout for ${orderId}:`, error);
        }
    }
}
