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
    placeOrder(@Req() req: any, @Body() body: any) {
        return this.ordersService.placeOrder(req.user.id, body);
    }

    @Get()
    @Roles(UserRole.CUSTOMER)
    @ApiOperation({ summary: 'Get order history' })
    getUserOrders(@Req() req: any, @Query('page') page?: number, @Query('limit') limit?: number) {
        return this.ordersService.getUserOrders(req.user.id, page, limit);
    }

    @Get('admin/stats')
    @Roles(UserRole.ADMIN)
    getAdminStats() {
        return this.ordersService.getAdminStats();
    }
    
    @Get('admin/finance/summary')
    @Roles(UserRole.ADMIN)
    getAdminFinanceSummary() {
        return this.ordersService.getAdminFinanceSummary();
    }

    @Get('delivery/pending')
    @Roles(UserRole.DELIVERY_PARTNER, UserRole.ADMIN)
    getPendingDeliveries(@Query('page') page?: number, @Query('limit') limit?: number) {
        return this.ordersService.getPendingDeliveries(page, limit);
    }

    @Get('restaurant/:id')
    @Roles(UserRole.RESTAURANT_OWNER, UserRole.ADMIN)
    getRestaurantOrders(@Param('id') id: string, @Query('status') status?: string, @Query('page') page?: number, @Query('limit') limit?: number) {
        return this.ordersService.getRestaurantOrders(id, status, page, limit);
    }

    @Get(':id')
    getOrderById(@Req() req: any, @Param('id') id: string) {
        return this.ordersService.getOrderById(id, req.user.id);
    }

    @Patch(':id/status')
    @Roles(UserRole.RESTAURANT_OWNER, UserRole.DELIVERY_PARTNER, UserRole.ADMIN)
    updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
        return this.ordersService.updateStatus(id, body.status as any);
    }

    @Patch(':id/accept')
    @Roles(UserRole.DELIVERY_PARTNER, UserRole.ADMIN)
    acceptDeliveryOrder(@Req() req: any, @Param('id') id: string) {
        return this.ordersService.acceptDeliveryOrder(id, req.user.id);
    }
    
    @Patch(':id/reassign')
    @Roles(UserRole.ADMIN)
    reassignOrder(@Param('id') id: string, @Body() body: { driverId: string }) {
        return this.ordersService.reassignOrder(id, body.driverId);
    }

    @Post(':id/cancel')
    @Roles(UserRole.CUSTOMER, UserRole.ADMIN)
    cancelOrder(@Req() req: any, @Param('id') id: string) {
        return this.ordersService.cancelOrder(id, req.user.id);
    }

    @Post(':id/review')
    @Roles(UserRole.CUSTOMER, UserRole.ADMIN)
    addReview(@Req() req: any, @Param('id') id: string, @Body() body: { rating: number; comment?: string }) {
        return this.ordersService.addReview(id, req.user.id, body);
    }
}
