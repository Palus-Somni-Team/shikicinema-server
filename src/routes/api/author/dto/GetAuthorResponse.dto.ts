import { ApiProperty } from '@nestjs/swagger';
import { Author } from '@app-routes/api/author/dto/Author.dto';
import { Expose, Type } from 'class-transformer';
import { GetAuthorResponse as Response } from '@lib-shikicinema';

export class GetAuthorResponse implements Response {
    @Expose()
    @Type(() => Author)
    @ApiProperty()
    data: Author[];

    @Expose()
    @ApiProperty()
    limit: number;

    @Expose()
    @ApiProperty()
    offset: number;

    @Expose()
    @ApiProperty()
    total: number;

    constructor(data?: Author[], limit?: number, offset?: number, total?: number) {
        this.limit = limit;
        this.offset = offset;
        this.data = data;
        this.total = total;
    }
}
