import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UploadTokenInfo {
    @Expose()
    @ApiProperty()
    token: string;

    @Expose()
    @ApiProperty()
    expiredAt: Date;
}
