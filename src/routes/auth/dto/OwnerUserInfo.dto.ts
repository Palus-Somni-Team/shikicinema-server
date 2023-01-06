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

    constructor(
        id: number,
        login: string,
        name: string,
        email: string,
        roles: Role[],
        shikimoriId: string | null,
        createdAt: Date,
        updatedAt: Date,
    ) {
        this.id = id;
        this.login = login;
        this.name = name;
        this.email = email;
        this.roles = roles;
        this.shikimoriId = shikimoriId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static create(entity: UserEntity): OwnerUserInfo {
        return new OwnerUserInfo(
            entity.id,
            entity.login,
            entity.name,
            entity.email,
            entity.roles,
            entity.uploader?.shikimoriId,
            entity.createdAt,
            entity.updatedAt,
        );
    }
}
