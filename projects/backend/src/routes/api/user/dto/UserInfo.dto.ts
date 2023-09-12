import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { User } from '@shikicinema/types';
import { UserEntity } from '~backend/entities';

@Exclude()
export class UserInfo implements User {
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
    @ApiProperty({ nullable: true })
    shikimoriId: string | null;

    constructor(entity?: UserEntity) {
        if (!entity) return;

        const {
            id,
            login,
            name,
            uploader,
        } = entity;

        this.id = id;
        this.login = login;
        this.name = name;
        this.shikimoriId = uploader?.shikimoriId || null;
    }
}
