import { Controller, Get, Patch, Post, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('me')
    @ApiOperation({ summary: 'Get current user profile' })
    getProfile(@Req() req: any) {
        return this.usersService.getProfile(req.user.id);
    }

    @Patch('me')
    @ApiOperation({ summary: 'Update user profile' })
    updateProfile(@Req() req: any, @Body() body: any) {
        return this.usersService.updateProfile(req.user.id, body);
    }

    @Get('me/addresses')
    @ApiOperation({ summary: 'Get user addresses' })
    getAddresses(@Req() req: any) {
        return this.usersService.getAddresses(req.user.id);
    }

    @Post('me/addresses')
    @ApiOperation({ summary: 'Add a new address' })
    addAddress(@Req() req: any, @Body() body: any) {
        return this.usersService.addAddress(req.user.id, body);
    }

    @Delete('me/addresses/:id')
    @ApiOperation({ summary: 'Delete an address' })
    deleteAddress(@Req() req: any, @Param('id') id: string) {
        return this.usersService.deleteAddress(req.user.id, id);
    }

    // ---- Admin Endpoints ----

    @Get()
    @ApiOperation({ summary: 'Get all users (Admin)' })
    getAllUsers(
        @Query('search') search?: string,
        @Query('role') role?: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.usersService.getAllUsers({ search, role, page, limit });
    }

    @Patch(':id/role')
    @ApiOperation({ summary: 'Update user role (Admin)' })
    updateUserRole(@Param('id') id: string, @Body() body: { role: string }) {
        return this.usersService.updateUserRole(id, body.role);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Toggle user active status (Admin)' })
    updateUserStatus(@Param('id') id: string, @Body() body: { isActive: boolean }) {
        return this.usersService.updateUserStatus(id, body.isActive);
    }
}
