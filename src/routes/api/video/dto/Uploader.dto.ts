import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Uploader as UploaderDto } from '@lib-shikicinema';

export class Uploader implements UploaderDto {
    @Expose()
    @ApiProperty()
    id: number;

    @Expose()
    @ApiProperty()
    banned: boolean;

    @Expose()
    @ApiProperty()
    shikimoriId: string;
}
