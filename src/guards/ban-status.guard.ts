import { BanStatusEnum } from '@app/types';
import { CanActivate, ExecutionContext, Injectable, mixin } from '@nestjs/common';
import { IRequest } from '@app-routes/auth/dto';
import { Role } from '@lib-shikicinema';
import { UserService } from '@app-services/user/user.service';

export const BanStatusGuard = (banStatus: BanStatusEnum) => {
    @Injectable()
    class BanStatusGuardMixin implements CanActivate {
        constructor(
            public userService: UserService,
        ) {}

        async canActivate(context: ExecutionContext): Promise<boolean> {
            const { user: id = null } = context.switchToHttp().getRequest() as IRequest;
            const user = id ? await this.userService.findById({ id }) : null;
            // todo replace == with ===
            // eslint-disable-next-line eqeqeq
            const hasBannedRole = user?.roles?.some((role) => role == Role.banned);

            return user && banStatus === BanStatusEnum.ALLOW_BANNED ? hasBannedRole : !hasBannedRole;
        }
    }

    return mixin(BanStatusGuardMixin);
};
