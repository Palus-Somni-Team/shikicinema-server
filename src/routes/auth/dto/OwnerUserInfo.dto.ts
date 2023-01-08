import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Role } from '@lib-shikicinema';
import { TransformRoles } from '@app-utils/class-transform.utils';
import { UserEntity } from '@app-entities';

@Exclude()
export class OwnerUserInfo {
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
    @ApiProperty()
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

    constructor(entity: UserEntity) {
        const {
            id,
            login,
            name,
            email,
            roles,
            createdAt,
            updatedAt,
            uploader = null,
        } = entity;

        this.id = id;
        this.login = login;
        this.name = name;
        this.email = email;
        this.roles = roles;
        this.shikimoriId = uploader?.shikimoriId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
