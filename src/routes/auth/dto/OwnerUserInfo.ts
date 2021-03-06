import { Exclude, Expose } from 'class-transformer';
import { Role } from '@lib-shikicinema';
import { TransformRoles } from '@app-utils/class-transform.utils';

@Exclude()
export class OwnerUserInfo {
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
