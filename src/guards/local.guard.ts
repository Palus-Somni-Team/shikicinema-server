import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class LocalGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const can = await super.canActivate(context) as boolean;
        await super.logIn(request);
        return can;
    }
}
