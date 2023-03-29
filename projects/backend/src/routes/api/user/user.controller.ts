import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    Get,
    Param,
    Query,
} from '@nestjs/common';

import { BaseController } from '~backend/routes/base.controller';
import { GetUserById, GetUsers } from '~backend/services/user/dto';
import { GetUsersResponse, UserInfo } from '~backend/routes/api/user/dto';
import { UserService } from '~backend/services/user/user.service';

@ApiTags('users')
export class UserController extends BaseController {
    constructor(
        private readonly userService: UserService,
    ) {
        super();
    }

    @Get()
    @ApiResponse({
        status: 200,
        description: 'Users list with matched parameters',
        type: GetUsersResponse,
        isArray: true,
    })
    async find(@Query() query: GetUsers): Promise<GetUsersResponse> {
        const limit = query.limit ?? 20;
        const offset = query.offset ?? 0;

        const [users, total] = await this.userService.findAll(
            limit,
            offset,
            query.id,
            query.login,
            query.name,
            query.email,
            query.shikimoriId,
            query.roles,
            query.createdAt,
        );

        return new GetUsersResponse(users.map((user) => new UserInfo(user)), limit, offset, total);
    }

    @Get(':id')
    @ApiResponse({ status: 200, description: 'User with specified id', type: UserInfo })
    @ApiResponse({ status: 404, description: 'Cannot find resource with provided parameters' })
    async findById(@Param() request: GetUserById): Promise<UserInfo> {
        const user = await this.userService.findById(request.id);
        return new UserInfo(user);
    }
}
