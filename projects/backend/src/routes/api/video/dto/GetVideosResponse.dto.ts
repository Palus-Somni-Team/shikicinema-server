import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { GetVideosResponse as Response } from '@shikicinema/types';
import { VideoResponse } from '~backend/routes/api/video/dto/VideoResponse.dto';

export class GetVideosResponse implements Response {
    @Expose()
    @ApiProperty()
    @Type(() => VideoResponse)
    data: VideoResponse[];

    @Expose()
    @ApiProperty()
    limit: number;

    @Expose()
    @ApiProperty()
    offset: number;

    @Expose()
    @ApiProperty()
    total: number;

    constructor(data?: VideoResponse[], limit?: number, offset?: number, total?: number) {
        this.data = data;
        this.limit = limit;
        this.offset = offset;
        this.total = total;
    }
}
