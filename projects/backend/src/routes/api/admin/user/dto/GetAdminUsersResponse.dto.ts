import { AdminUserInfo } from '~backend/routes/api/admin/user/dto/AdminUserInfo.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { GetAdminUsersResponse as Response } from '@shikicinema/types';

export class GetAdminUsersResponse implements Response {
    @Expose()
    @Type(() => AdminUserInfo)
    @ApiProperty()
    data: AdminUserInfo[];

    @Expose()
    @ApiProperty()
    limit: number;

    @Expose()
    @ApiProperty()
    offset: number;

    @Expose()
    @ApiProperty()
    total: number;

    constructor(data?: AdminUserInfo[], limit?: number, offset?: number, total?: number) {
        this.data = data;
        this.limit = limit;
        this.offset = offset;
        this.total = total;
    }
}
