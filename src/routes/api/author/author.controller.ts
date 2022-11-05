import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Author } from '@app-routes/api/author/dto/Author.dto';
import { AuthorService } from '@app-services/author/author.service';
import { BaseController } from '@app-routes/base.controller';
import { Get, Query } from '@nestjs/common';
import { GetAuthorResponse } from '@app-routes/api/author/dto/GetAuthorResponse';
import { GetAuthorsRequest } from '@app-routes/api/author/dto/GetAuthorsRequest';

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
        const authors = await this.authorService.get(query.name, query.limit, query.offset);
        return new GetAuthorResponse(
            authors.map((_) => new Author(_.id, _.name)),
            query.limit,
            query.offset,
        );
    }
}
