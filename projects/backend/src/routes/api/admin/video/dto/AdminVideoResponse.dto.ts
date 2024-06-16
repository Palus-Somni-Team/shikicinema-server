import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { VideoEntity } from '~backend/entities/video';
import { VideoResponse } from '~backend/routes/api/video/dto';

export class AdminVideoResponse extends VideoResponse {
    @ApiProperty()
    @Type(() => Date)
    deletedAt?: Date;

    constructor(entity?: VideoEntity) {
        super(entity);
        this.deletedAt = entity?.deletedAt;
    }
}
