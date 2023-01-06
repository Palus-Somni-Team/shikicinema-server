import { AdminUser, Role } from '@lib-shikicinema';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { TransformRoles } from '@app-utils/class-transform.utils';
import { UserEntity } from '@app-entities';

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

    constructor(
        id: number,
        login: string,
        name: string,
        email: string,
        roles: Role[],
        shikimoriId: string | null,
        createdAt: Date,
        updatedAt: Date) {
        this.id = id;
        this.login = login;
        this.name = name;
        this.email = email;
        this.roles = roles;
        this.shikimoriId = shikimoriId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static create(user: UserEntity): AdminUserInfo {
        return new AdminUserInfo(
            user.id,
            user.login,
            user.name,
            user.email,
            user.roles,
            user.uploader?.shikimoriId,
            user.createdAt,
            user.updatedAt,
        );
    }
}
