import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class PaymentsService {
    constructor(private readonly prisma: PrismaService) { }

    async initiatePayment(orderId: string) {
        const payment = await this.prisma.payment.findUnique({
            where: { orderId },
            include: { order: { select: { total: true, userId: true } } },
        });

        if (!payment) throw new NotFoundException('Payment not found');
        if (payment.status !== 'PENDING') {
            throw new BadRequestException('Payment already processed');
        }

        // TODO: Integrate with Razorpay/Stripe
        // For now, return payment details for client-side SDK
        return {
            paymentId: payment.id,
            orderId: payment.orderId,
            amount: payment.amount,
            currency: 'INR',
            // razorpayOrderId: created via Razorpay API
        };
    }

    async handleWebhook(payload: any, _signature: string) {
        // TODO: Verify webhook signature from Razorpay/Stripe

        const { orderId, status, gatewayTransactionId } = payload;

        await this.prisma.payment.update({
            where: { orderId },
            data: {
                status: status === 'success' ? 'SUCCESS' : 'FAILED',
                gatewayTransactionId,
            },
        });

        // If payment successful, confirm the order
        if (status === 'success') {
            await this.prisma.order.update({
                where: { id: orderId },
                data: { status: 'CONFIRMED' },
            });
        }

        return { received: true };
    }
}
