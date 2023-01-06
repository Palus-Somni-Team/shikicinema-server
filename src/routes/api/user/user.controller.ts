import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    Get,
    Param,
    Query,
} from '@nestjs/common';

import { BaseController } from '@app-routes/base.controller';
import { GetUserById, GetUsers } from '@app-services/user/dto';
import { UserInfo } from '@app-routes/api/user/dto/UserInfo.dto';
import { UserService } from '@app-services/user/user.service';

@ApiTags('users')
export class UserController extends BaseController {
    constructor(
        private readonly userService: UserService,
    ) {
        super();
    }

    @Get()
    @ApiResponse({ status: 200, description: 'Users list with matched parameters', type: UserInfo, isArray: true })
    async find(@Query() query: GetUsers): Promise<UserInfo[]> {
        const users = await this.userService.findAll(query);
        return users.map(UserInfo.create);
    }

    @Get(':id')
    @ApiResponse({ status: 200, description: 'User with specified id', type: UserInfo })
    @ApiResponse({ status: 404, description: 'Cannot find resource with provided parameters' })
    async findById(@Param() id: GetUserById): Promise<UserInfo> {
        const user = await this.userService.findById(id);
        return UserInfo.create(user);
    }
}
