import { Controller, Get, Post, Patch, Param, Query, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RestaurantsService } from './restaurants.service';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantsController {
    constructor(private readonly restaurantsService: RestaurantsService) { }

    @Get()
    @ApiOperation({ summary: 'List restaurants with filters' })
    @ApiQuery({ name: 'search', required: false })
    @ApiQuery({ name: 'cuisine', required: false })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    findAll(
        @Query('search') search?: string,
        @Query('cuisine') cuisine?: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.restaurantsService.findAll({ search, cuisine, page, limit });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get restaurant details with full menu' })
    findById(@Param('id') id: string) {
        return this.restaurantsService.findById(id);
    }

    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Create a new restaurant (restaurant owner)' })
    create(@Req() req: any, @Body() body: any) {
        return this.restaurantsService.create(req.user.id, body);
    }

    @Patch(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update restaurant details (owner only)' })
    update(@Req() req: any, @Param('id') id: string, @Body() body: any) {
        return this.restaurantsService.update(id, req.user.id, body);
    }
}
