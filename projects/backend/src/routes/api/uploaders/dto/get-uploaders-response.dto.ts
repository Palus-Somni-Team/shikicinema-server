import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { GetUploadersResponse as Response } from '@shikicinema/types';
import { UploaderInfo } from '~backend/routes/auth/dto/UploaderInfo.dto';

export class GetUploadersResponse implements Response {
    @Expose()
    @Type(() => UploaderInfo)
    @ApiProperty({ type: [UploaderInfo] })
    data: UploaderInfo[];

    @Expose()
    @ApiProperty()
    limit: number;

    @Expose()
    @ApiProperty()
    offset: number;

    @Expose()
    @ApiProperty()
    total: number;

    constructor(data?: UploaderInfo[], limit?: number, offset?: number, total?: number) {
        this.limit = limit;
        this.offset = offset;
        this.data = data;
        this.total = total;
    }
}
