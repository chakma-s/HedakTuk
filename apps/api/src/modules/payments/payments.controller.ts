import { Controller, Post, Body, Param, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('initiate/:orderId')
    @ApiOperation({ summary: 'Initiate payment for an order' })
    initiate(@Param('orderId') orderId: string) {
        return this.paymentsService.initiatePayment(orderId);
    }

    @Post('webhook')
    @ApiOperation({ summary: 'Payment gateway webhook callback' })
    webhook(@Body() payload: any, @Headers('x-razorpay-signature') signature: string) {
        return this.paymentsService.handleWebhook(payload, signature);
    }

    @Post('verify')
    @ApiOperation({ summary: 'Verify client payment transaction' })
    verifyPayment(@Body() body: { orderId: string; paymentId: string; status?: string }) {
        return this.paymentsService.verifyPayment(body);
    }
}
