import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
    constructor(private readonly config: ConfigService) { }

    // ---- Push Notifications (Firebase Cloud Messaging) ----

    async sendPushNotification(deviceToken: string, title: string, body: string, _data?: Record<string, string>) {
        // TODO: Integrate Firebase Admin SDK
        // const message = { notification: { title, body }, data, token: deviceToken };
        // await admin.messaging().send(message);
        console.log(`📲 Push notification → ${deviceToken}: ${title} - ${body}`);
    }

    async sendOrderStatusPush(deviceToken: string, orderId: string, status: string) {
        const messages: Record<string, string> = {
            CONFIRMED: 'Your order has been confirmed by the restaurant! 🎉',
            PREPARING: 'Your food is being prepared 👨‍🍳',
            READY: 'Your order is ready for pickup! 📦',
            PICKED_UP: 'Your order has been picked up by the delivery partner 🚴',
            OUT_FOR_DELIVERY: 'Your order is on its way! 🛵',
            DELIVERED: 'Your order has been delivered! Enjoy your meal 🍽️',
            CANCELLED: 'Your order has been cancelled ❌',
        };

        const message = messages[status] || `Order status updated to ${status}`;
        await this.sendPushNotification(deviceToken, 'Order Update', message, { orderId, status });
    }

    // ---- Email Notifications ----

    async sendEmail(to: string, subject: string, _html: string) {
        // TODO: Integrate Nodemailer or SendGrid
        console.log(`📧 Email → ${to}: ${subject}`);
    }

    async sendOrderConfirmationEmail(email: string, orderId: string, total: number) {
        const html = `
      <h1>Order Confirmed! 🎉</h1>
      <p>Your order <strong>#${orderId.slice(0, 8)}</strong> has been placed successfully.</p>
      <p>Total: <strong>₹${total.toFixed(2)}</strong></p>
      <p>You can track your order in the app.</p>
    `;
        await this.sendEmail(email, 'Order Confirmed!', html);
    }

    // ---- SMS ----

    async sendSms(phone: string, message: string) {
        // TODO: Integrate MSG91 or Twilio
        console.log(`📱 SMS → ${phone}: ${message}`);
    }
}
