import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Uploader } from '@shikicinema/types';
import { UploaderEntity } from '~backend/entities';

@Exclude()
export class UploaderInfo implements Uploader {
    @Expose()
    @ApiProperty()
    id: number;

    @Expose()
    @ApiProperty()
    banned: boolean;

    @Expose()
    @ApiProperty()
    shikimoriId: string;

    @Expose()
    @ApiProperty()
    userId: number | null;

    constructor(entity?: UploaderEntity) {
        if (!entity) return;

        const { id, banned, shikimoriId, user } = entity;
        this.id = id;
        this.banned = banned;
        this.shikimoriId = shikimoriId;
        this.userId = user?.id || null;
    }
}
