import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthorService } from '@app-services/author/author.service';
import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { GetAuthorResponse } from '@app-routes/api/author/dto/GetAuthorResponse';
import { GetAuthorsRequest } from '@app-routes/api/author/dto/GetAuthorsRequest';

@Controller()
@ApiTags('authors')
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthorController {
    constructor(protected readonly authorService: AuthorService) {
    }

    @Get()
    @ApiResponse({ status: 200, description: 'Authors found by name or it\'s part', type: GetAuthorResponse })
    async search(@Query() query: GetAuthorsRequest): Promise<GetAuthorResponse> {
        return this.authorService.get(query);
    }
}
