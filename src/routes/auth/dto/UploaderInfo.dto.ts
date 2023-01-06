import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Uploader as Interface } from '@lib-shikicinema';
import { UploaderEntity } from '@app-entities';

@Exclude()
export class UploaderInfo implements Interface {
    @Expose()
    @ApiProperty()
    id: number;

    @Expose()
    @ApiProperty()
    banned: boolean;

    @Expose()
    @ApiProperty()
    shikimoriId: string;

    constructor(
        id: number,
        banned: boolean,
        shikimoriId: string,
    ) {
        this.id = id;
        this.banned = banned;
        this.shikimoriId = shikimoriId;
    }

    public static create(entity: UploaderEntity): UploaderInfo {
        return new UploaderInfo(
            entity.id,
            entity.banned,
            entity.shikimoriId,
        );
    }
}
