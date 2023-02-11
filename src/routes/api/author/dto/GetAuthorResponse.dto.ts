import { Author } from '@app-routes/api/author/dto/Author.dto';
import { GetAuthorResponse as Response } from '@lib-shikicinema';

export class GetAuthorResponse implements Response {
    data: Author[];
    limit: number;
    offset: number;
    total: number;

    constructor(data: Author[], limit: number, offset: number, total: number) {
        this.limit = limit;
        this.offset = offset;
        this.data = data;
        this.total = total;
    }
}
