import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { Role } from '@shikicinema/types';
import { TransformRoles, userRolesEntityMapToRole } from '~backend/utils/class-transform.utils';
import { UserEntity } from '~backend/entities';

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
    @Type(() => Date)
    createdAt: Date;

    @Expose()
    @ApiProperty()
    @Type(() => Date)
    updatedAt: Date;

    constructor(entity?: UserEntity) {
        if (!entity) return;

        const {
            id,
            login,
            name,
            email,
            roles = [],
            createdAt,
            updatedAt,
            uploader = null,
        } = entity;

        this.id = id;
        this.login = login;
        this.name = name;
        this.email = email;
        this.roles = roles ? roles.map(userRolesEntityMapToRole) : [];
        this.shikimoriId = uploader?.shikimoriId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
