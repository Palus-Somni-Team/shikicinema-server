import {
    CanActivate,
    ExecutionContext,
    Injectable,
    SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@shikicinema/types';

import { IRequest } from '~backend/routes/auth/dto';
import { UserService } from '~backend/services/user/user.service';

/**
 * List allowed user' roles for a handler or entire controller.
 * NOTE that handlers roles are preferred than controller if both set.
 *
 * @param {Array<Role>} roles - list of allowed roles
 * @return {any}
 */
export function AllowRoles(...roles: Role[]) {
    return SetMetadata('roles', roles);
}

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private userService: UserService
    ) {}

    private matchRoles(allowed: Role[], roles: Role[]): boolean {
        // todo replace == with ===
        // eslint-disable-next-line eqeqeq
        return allowed.some((role) => roles.some((r) => r == role));
    }

    private getAllowedRoles(context: ExecutionContext): Role[] {
        const rolesOnHandlerLevel = this.reflector.get<Role[]>('roles', context.getHandler());
        const rolesOnClassLevel = this.reflector.get<Role[]>('roles', context.getClass());

        return rolesOnHandlerLevel || rolesOnClassLevel;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const allowedRoles = this.getAllowedRoles(context);

        if (!allowedRoles || allowedRoles.length === 0) {
            return true;
        }

        try {
            const request = context.switchToHttp().getRequest() as IRequest;
            const user = await this.userService.findById(request.user);

            return this.matchRoles(allowedRoles, user.roles);
        } catch (e) {
            return false;
        }
    }
}
