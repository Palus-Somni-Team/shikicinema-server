import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { User } from '@lib-shikicinema';
import { UserEntity } from '@app-entities';

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

    constructor(
        id: number,
        login: string,
        name: string,
        shikimoriId: string | null
    ) {
        this.id = id;
        this.login = login;
        this.name = name;
        this.shikimoriId = shikimoriId;
    }

    public static create(entity: UserEntity): UserInfo {
        return new UserInfo(
            entity.id,
            entity.login,
            entity.name,
            entity.uploader?.shikimoriId,
        );
    }
}
