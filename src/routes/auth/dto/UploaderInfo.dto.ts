import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UploaderInfo {
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
