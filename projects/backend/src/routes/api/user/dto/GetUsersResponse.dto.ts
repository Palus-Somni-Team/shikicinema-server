import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { GetUsersResponse as Response, User } from '@shikicinema/types';

import { UserInfo } from '~backend/routes/api/user/dto/UserInfo.dto';

export class GetUsersResponse implements Response {
    @Expose()
    @ApiProperty({ type: [UserInfo] })
    data: User[];

    @Expose()
    @ApiProperty()
    limit: number;

    @Expose()
    @ApiProperty()
    offset: number;

    @Expose()
    @ApiProperty()
    total: number;

    constructor(data: User[], limit: number, offset: number, total: number) {
        this.data = data;
        this.limit = limit;
        this.offset = offset;
        this.total = total;
    }
}
