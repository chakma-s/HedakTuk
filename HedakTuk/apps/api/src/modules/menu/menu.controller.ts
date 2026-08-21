import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { MenuService } from './menu.service';

@ApiTags('menu')
@Controller('restaurants/:restaurantId/menu')
export class MenuController {
    constructor(private readonly menuService: MenuService) { }

    // ---- Categories ----

    @Get('categories')
    @ApiOperation({ summary: 'Get menu categories for a restaurant' })
    getCategories(@Param('restaurantId') restaurantId: string) {
        return this.menuService.getCategories(restaurantId);
    }

    @Post('categories')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Create a menu category' })
    createCategory(@Param('restaurantId') restaurantId: string, @Body() body: any) {
        return this.menuService.createCategory(restaurantId, body);
    }

    @Patch('categories/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update a menu category' })
    updateCategory(@Param('id') id: string, @Body() body: any) {
        return this.menuService.updateCategory(id, body);
    }

    @Delete('categories/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Delete a menu category' })
    deleteCategory(@Param('id') id: string) {
        return this.menuService.deleteCategory(id);
    }

    // ---- Items ----

    @Get('items')
    @ApiOperation({ summary: 'Get menu items for a restaurant' })
    getItems(@Param('restaurantId') restaurantId: string, @Query('categoryId') categoryId?: string) {
        return this.menuService.getItems(restaurantId, categoryId);
    }

    @Post('items')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Create a menu item' })
    createItem(@Param('restaurantId') restaurantId: string, @Body() body: any) {
        return this.menuService.createItem(restaurantId, body);
    }

    @Patch('items/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update a menu item' })
    updateItem(@Param('id') id: string, @Body() body: any) {
        return this.menuService.updateItem(id, body);
    }

    @Delete('items/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Delete a menu item' })
    deleteItem(@Param('id') id: string) {
        return this.menuService.deleteItem(id);
    }
}
