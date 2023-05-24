import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { GetVideoRequestsResponse as Response } from '@shikicinema/types';
import { VideoRequest } from '~backend/routes/api/requests/video/dto';

export class GetVideoRequestsResponse implements Response {
    @Expose()
    @Type(() => VideoRequest)
    @ApiProperty()
    data: VideoRequest[];

    @Expose()
    @ApiProperty()
    limit: number;

    @Expose()
    @ApiProperty()
    offset: number;

    @Expose()
    @ApiProperty()
    total: number;

    constructor(data?: VideoRequest[], limit?: number, offset?: number, total?: number) {
        this.limit = limit;
        this.offset = offset;
        this.data = data;
        this.total = total;
    }
}
