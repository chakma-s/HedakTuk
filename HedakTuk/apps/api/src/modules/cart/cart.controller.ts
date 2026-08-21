import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CartService } from './cart.service';

@ApiTags('cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get()
    @ApiOperation({ summary: 'Get current cart' })
    getCart(@Req() req: any) {
        return this.cartService.getCart(req.user.id);
    }

    @Post('items')
    @ApiOperation({ summary: 'Add item to cart' })
    addItem(@Req() req: any, @Body() body: { menuItemId: string; quantity?: number }) {
        return this.cartService.addItem(req.user.id, body.menuItemId, body.quantity);
    }

    @Patch('items/:id')
    @ApiOperation({ summary: 'Update cart item quantity' })
    updateItem(@Req() req: any, @Param('id') id: string, @Body() body: { quantity: number }) {
        return this.cartService.updateItemQuantity(req.user.id, id, body.quantity);
    }

    @Delete('items/:id')
    @ApiOperation({ summary: 'Remove item from cart' })
    removeItem(@Req() req: any, @Param('id') id: string) {
        return this.cartService.removeItem(req.user.id, id);
    }

    @Delete()
    @ApiOperation({ summary: 'Clear cart' })
    clearCart(@Req() req: any) {
        return this.cartService.clearCart(req.user.id);
    }
}
