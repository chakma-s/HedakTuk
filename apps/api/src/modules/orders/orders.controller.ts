import { Controller, Get, Post, Patch, Param, Query, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { OrdersService } from './orders.service';
import { UserRole } from '@hedaktuk/shared-types';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @Roles(UserRole.CUSTOMER)
    @ApiOperation({ summary: 'Place an order from cart' })
    placeOrder(@Req() req: any, @Body() body: {
        restaurantId: string;
        items: any[];
        addressId?: string;
        deliveryAddress?: any;
        couponCode?: string;
        specialInstructions?: string;
        paymentMethod: string;
    }) {
        return this.ordersService.placeOrder(req.user.id, body);
    }

    @Get()
    @Roles(UserRole.CUSTOMER)
    @ApiOperation({ summary: 'Get order history' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    getUserOrders(@Req() req: any, @Query('page') page?: number, @Query('limit') limit?: number) {
        return this.ordersService.getUserOrders(req.user.id, page, limit);
    }

    @Get('admin/stats')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Get global stats for admin' })
    getAdminStats() {
        return this.ordersService.getAdminStats();
    }

    @Get('delivery/pending')
    @Roles(UserRole.DELIVERY_PARTNER, UserRole.ADMIN)
    @ApiOperation({ summary: 'Get pending orders for delivery partners' })
    getPendingDeliveries(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.ordersService.getPendingDeliveries(page, limit);
    }

    @Get('restaurant/:id')
    @Roles(UserRole.RESTAURANT_OWNER, UserRole.ADMIN)
    @ApiOperation({ summary: 'Get orders for a restaurant' })
    @ApiQuery({ name: 'status', required: false })
    getRestaurantOrders(
        @Param('id') id: string,
        @Query('status') status?: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.ordersService.getRestaurantOrders(id, status, page, limit);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get order details' })
    getOrderById(@Req() req: any, @Param('id') id: string) {
        return this.ordersService.getOrderById(id, req.user.id);
    }

    @Patch(':id/status')
    @Roles(UserRole.RESTAURANT_OWNER, UserRole.DELIVERY_PARTNER, UserRole.ADMIN)
    @ApiOperation({ summary: 'Update order status (restaurant/delivery/admin)' })
    updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
        return this.ordersService.updateStatus(id, body.status as any);
    }

    @Patch(':id/accept')
    @Roles(UserRole.DELIVERY_PARTNER, UserRole.ADMIN)
    @ApiOperation({ summary: 'Accept delivery request (delivery partner)' })
    acceptDeliveryOrder(@Req() req: any, @Param('id') id: string) {
        return this.ordersService.acceptDeliveryOrder(id, req.user.id);
    }

    @Post(':id/cancel')
    @Roles(UserRole.CUSTOMER, UserRole.ADMIN)
    @ApiOperation({ summary: 'Cancel an order' })
    cancelOrder(@Req() req: any, @Param('id') id: string) {
        return this.ordersService.cancelOrder(id, req.user.id);
    }

    @Post(':id/review')
    @Roles(UserRole.CUSTOMER, UserRole.ADMIN)
    @ApiOperation({ summary: 'Submit rating and review for delivered order' })
    addReview(@Req() req: any, @Param('id') id: string, @Body() body: { rating: number; comment?: string }) {
        return this.ordersService.addReview(id, req.user.id, body);
    }
}
