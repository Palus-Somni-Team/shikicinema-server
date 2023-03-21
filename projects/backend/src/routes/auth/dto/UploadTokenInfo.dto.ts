import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UploadTokenEntity } from '~backend/entities';

@Exclude()
export class UploadTokenInfo {
    @Expose()
    @ApiProperty()
        token: string;

    @Expose()
    @ApiProperty()
        expiredAt: Date;

    constructor(entity: UploadTokenEntity) {
        const { token, expiredAt } = entity;

        this.token = token;
        this.expiredAt = expiredAt;
    }
}
