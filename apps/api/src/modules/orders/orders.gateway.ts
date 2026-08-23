import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketEvent, OrderStatus } from '@hedaktuk/shared-types';

@WebSocketGateway({
    cors: { origin: '*' },
    namespace: '/orders',
})
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        console.log(`🔌 Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`🔌 Client disconnected: ${client.id}`);
    }

    @SubscribeMessage(SocketEvent.JOIN_ORDER_ROOM)
    handleJoinOrderRoom(client: Socket, orderId: string) {
        client.join(`order:${orderId}`);
        console.log(`📦 Client ${client.id} joined order room: ${orderId}`);
    }

    @SubscribeMessage(SocketEvent.LEAVE_ORDER_ROOM)
    handleLeaveOrderRoom(client: Socket, orderId: string) {
        client.leave(`order:${orderId}`);
    }

    @SubscribeMessage('driver_location_update')
    handleDriverLocationUpdate(
        client: Socket,
        data: { orderId: string; latitude: number; longitude: number; heading?: number },
    ) {
        this.server.to(`order:${data.orderId}`).emit(SocketEvent.DELIVERY_LOCATION_UPDATED, {
            orderId: data.orderId,
            latitude: data.latitude,
            longitude: data.longitude,
            heading: data.heading,
            updatedAt: new Date().toISOString(),
        });
    }

    // ---- Emit Methods (called by OrdersService) ----

    notifyOrderStatusUpdate(orderId: string, status: OrderStatus) {
        this.server.to(`order:${orderId}`).emit(SocketEvent.ORDER_STATUS_UPDATED, {
            orderId,
            status,
            updatedAt: new Date().toISOString(),
        });
    }

    notifyNewOrder(restaurantId: string, order: any) {
        this.server.to(`restaurant:${restaurantId}`).emit(SocketEvent.NEW_ORDER_RECEIVED, order);
    }
}
