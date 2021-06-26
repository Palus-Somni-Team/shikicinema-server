import { AdminUser, Role } from '@lib-shikicinema';
import { Exclude, Expose } from 'class-transformer';
import { TransformRoles } from '@app-utils/class-transform.utils';

@Exclude()
export class AdminUserInfo implements AdminUser {
    @Expose()
    id: number;

    @Expose()
    login: string;

    @Expose()
    name: string;

    @Expose()
    email: string;

    @Expose()
    @TransformRoles()
    roles: Role[];

    @Expose()
    shikimoriId: string | null;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}
