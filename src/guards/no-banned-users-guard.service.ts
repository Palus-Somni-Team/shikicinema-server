import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { IRequest } from '@app-routes/auth/dto';
import { Role } from '@lib-shikicinema';
import { UserService } from '@app-services/user/user.service';

@Injectable()
export class NoBannedUsersGuard implements CanActivate {
    constructor(
        public userService: UserService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const { user: id = null } = context.switchToHttp().getRequest() as IRequest;
            const user = id
                ? await this.userService.findById(id)
                : null;
            // todo replace == with ===
            // eslint-disable-next-line eqeqeq
            const hasBannedRole = user.roles.some((role) => role == Role.banned);

            return !hasBannedRole;
        } catch (e) {
            return false;
        }
    }
}
