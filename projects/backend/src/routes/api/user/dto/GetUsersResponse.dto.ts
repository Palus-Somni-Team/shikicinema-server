import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { GetUsersResponse as Response, User } from '@shikicinema/types';

export class GetUsersResponse implements Response {
    @Expose()
    @ApiProperty()
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
