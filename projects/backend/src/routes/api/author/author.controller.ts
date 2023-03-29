import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Author, GetAuthorResponse, GetAuthorsRequest } from '~backend/routes/api/author/dto';
import { AuthorService } from '~backend/services/author/author.service';
import { BaseController } from '~backend/routes/base.controller';
import { Get, Query } from '@nestjs/common';

@ApiTags('authors')
export class AuthorController extends BaseController {
    constructor(protected readonly authorService: AuthorService) {
        super();
    }

    @Get()
    @ApiResponse({ status: 200, description: 'Authors found by name or it\'s part', type: GetAuthorResponse })
    async search(@Query() query: GetAuthorsRequest): Promise<GetAuthorResponse> {
        query.limit ??= 20;
        query.offset ??= 0;
        const [authors, total] = await this.authorService.get(query.name, query.limit, query.offset);
        return new GetAuthorResponse(
            authors.map((author) => new Author(author)),
            query.limit,
            query.offset,
            total,
        );
    }
}
