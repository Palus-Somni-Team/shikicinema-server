import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { IRequest } from '~backend/routes/auth/dto';
import { Role } from '@shikicinema/types';
import { UserService } from '~backend/services/user/user.service';
import { userRolesEntityMapToRole } from '~backend/utils/class-transform.utils';

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
            // TODO: undefined case should be covered!
            const roles = user?.roles?.map(userRolesEntityMapToRole);
            const hasBannedRole = roles.some((role) => role === Role.banned);

            return !hasBannedRole;
        } catch (e) {
            return false;
        }
    }
}
