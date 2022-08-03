import { AdminUser, Role } from '@lib-shikicinema';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { TransformRoles } from '@app-utils/class-transform.utils';

@Exclude()
export class AdminUserInfo implements AdminUser {
    @Expose()
    @ApiProperty()
    id: number;

    @Expose()
    @ApiProperty()
    login: string;

    @Expose()
    @ApiProperty()
    name: string;

    @Expose()
    @ApiProperty({ format: 'email' })
    email: string;

    @Expose()
    @TransformRoles()
    @ApiProperty({
        enum: Role,
        isArray: true,
    })
    roles: Role[];

    @Expose()
    @ApiProperty({ nullable: true })
    shikimoriId: string | null;

    @Expose()
    @ApiProperty()
    createdAt: Date;

    @Expose()
    @ApiProperty()
    updatedAt: Date;
}
