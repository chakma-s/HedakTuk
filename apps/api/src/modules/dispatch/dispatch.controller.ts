import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { UserRole } from '@hedaktuk/shared-types';
import { DispatchService } from './dispatch.service';

@Controller('dispatch')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DELIVERY_PARTNER)
export class DispatchController {
    constructor(private readonly dispatchService: DispatchService) {}

    @Post('online')
    async goOnline(@Req() req: any, @Body() body: { latitude: number; longitude: number }) {
        await this.dispatchService.registerDriverOnline(req.user.id, body.latitude, body.longitude);
        return { success: true };
    }

    @Post('offline')
    async goOffline(@Req() req: any) {
        await this.dispatchService.registerDriverOffline(req.user.id);
        return { success: true };
    }

    @Post('location')
    async updateLocation(@Req() req: any, @Body() body: { latitude: number; longitude: number }) {
        await this.dispatchService.updateDriverLocation(req.user.id, body.latitude, body.longitude);
        return { success: true };
    }
}
