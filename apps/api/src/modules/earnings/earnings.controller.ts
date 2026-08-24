import { Controller, Get, Req, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { UserRole } from '@hedaktuk/shared-types';
import { EarningsService } from './earnings.service';

@Controller('earnings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EarningsController {
    constructor(private readonly earningsService: EarningsService) {}

    @Get('my')
    @Roles(UserRole.DELIVERY_PARTNER)
    async getMyEarningsSummary(@Req() req: any) {
        return this.earningsService.getDriverEarningsSummary(req.user.id);
    }

    @Get('my/history')
    @Roles(UserRole.DELIVERY_PARTNER)
    async getMyEarningsHistory(@Req() req: any, @Query('page') page: number = 1, @Query('limit') limit: number = 10) {
        return this.earningsService.getDriverEarningsHistory(req.user.id, page, limit);
    }

    @Get('admin/payouts')
    @Roles(UserRole.ADMIN)
    async getAdminPayouts() {
        return this.earningsService.getAdminPayoutSummary();
    }
}
