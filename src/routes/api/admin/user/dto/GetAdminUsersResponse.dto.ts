import { AdminUser, GetAdminUsersResponse as Response } from '@lib-shikicinema';

export class GetAdminUsersResponse implements Response {
    data: AdminUser[];
    limit: number;
    offset: number;
    total: number;

    constructor(data: AdminUser[], limit: number, offset: number, total: number) {
        this.data = data;
        this.limit = limit;
        this.offset = offset;
        this.total = total;
    }
}
