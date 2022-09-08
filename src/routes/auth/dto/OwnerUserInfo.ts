import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Role } from '@lib-shikicinema';
import { TransformRoles } from '@app-utils/class-transform.utils';

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
}
