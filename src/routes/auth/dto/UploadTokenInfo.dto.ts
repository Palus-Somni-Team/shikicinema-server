import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UploadTokenEntity } from '@app-entities';

@Exclude()
export class UploadTokenInfo {
    @Expose()
    @ApiProperty()
    token: string;

    @Expose()
    @ApiProperty()
    expiredAt: Date;

    constructor(
        token: string,
        expiredAt: Date,
    ) {
        this.token = token;
        this.expiredAt = expiredAt;
    }

    public static create(entity: UploadTokenEntity): UploadTokenInfo {
        return new UploadTokenInfo(
            entity.token,
            entity.expiredAt,
        );
    }
}
