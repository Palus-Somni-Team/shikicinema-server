import { AdminVideoResponse } from '~backend/routes/api/admin/video/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { GetVideosResponse } from '~backend/routes/api/video/dto';

export class AdminGetVideosResponse implements GetVideosResponse {
    @Expose()
    @ApiProperty()
    @Type(() => AdminVideoResponse)
    data: AdminVideoResponse[];

    @Expose()
    @ApiProperty()
    limit: number;

    @Expose()
    @ApiProperty()
    offset: number;

    @Expose()
    @ApiProperty()
    total: number;

    constructor(data?: AdminVideoResponse[], limit?: number, offset?: number, total?: number) {
        this.data = data;
        this.limit = limit;
        this.offset = offset;
        this.total = total;
    }
}
