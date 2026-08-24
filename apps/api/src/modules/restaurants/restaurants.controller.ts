import { Controller, Get, Post, Patch, Param, Query, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { RestaurantsService } from './restaurants.service';
import { UserRole } from '@hedaktuk/shared-types';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantsController {
    constructor(private readonly restaurantsService: RestaurantsService) { }

    @Get()
    findAll(@Query('search') search?: string, @Query('cuisine') cuisine?: string, @Query('page') page?: number, @Query('limit') limit?: number) {
        return this.restaurantsService.findAll({ search, cuisine, page, limit });
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.restaurantsService.findById(id);
    }

    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    create(@Req() req: any, @Body() body: any) {
        return this.restaurantsService.create(req.user.id, body);
    }

    @Patch(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    update(@Req() req: any, @Param('id') id: string, @Body() body: any) {
        return this.restaurantsService.update(id, req.user.id, body);
    }

    @Patch(':id/commission')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    updateCommissionRate(@Param('id') id: string, @Body() body: { commissionRate: number }) {
        return this.restaurantsService.updateCommissionRate(id, body.commissionRate);
    }

    @Get('admin/all')
    findAllAdmin(@Query('search') search?: string, @Query('page') page?: number, @Query('limit') limit?: number) {
        return this.restaurantsService.findAllAdmin({ search, page, limit });
    }

    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body() body: { isActive: boolean }) {
        return this.restaurantsService.updateStatus(id, body.isActive);
    }
}
