import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    private readonly logger = new Logger(JwtAuthGuard.name);

    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        // DEV ONLY: Soft login bypass via x-user-id header
        // TODO: Remove this entire block before production launch
        if (process.env.NODE_ENV !== 'production') {
            const userId = request.headers['x-user-id'];
            if (userId) {
                const role = request.headers['x-user-role'] || 'CUSTOMER';
                request.user = { id: userId, role };
                this.logger.warn(`⚠️ Dev auth bypass: user=${userId}, role=${role}`);
                return true;
            }
        }

        // Production: actual JWT verification
        return super.canActivate(context);
    }
}
