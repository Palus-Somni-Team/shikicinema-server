import {
    ApiCookieAuth,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import {
    Body,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { Role } from '@shikicinema/types';

import { AdminUserInfo } from '~backend/routes/api/admin/user/dto/AdminUserInfo.dto';
import { AllowRoles, RoleGuard } from '~backend/guards/role.guard';
import { BaseController } from '~backend/routes/base.controller';
import {
    CreateUser,
    GetUserById,
    GetUsers,
    UpdateUser,
} from '~backend/services/user/dto';
import { GetAdminUsersResponse } from '~backend/routes/api/admin/user/dto';
import { UserService } from '~backend/services/user/user.service';

@AllowRoles(Role.admin)
@UseGuards(RoleGuard)
@ApiTags('users (admin)')
@ApiCookieAuth()
@ApiResponse({ status: 403, description: 'Authorized only for admin accounts' })
export class AdminUserController extends BaseController {
    constructor(
        private readonly userService: UserService,
    ) {
        super();
    }

    @Get()
    @ApiResponse({
        status: 200,
        description: 'Users list with matched parameters',
        type: GetAdminUsersResponse,
        isArray: true,
    })
    async find(@Query() query: GetUsers): Promise<GetAdminUsersResponse> {
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

        return new GetAdminUsersResponse(users.map((user) => new AdminUserInfo(user)), limit, offset, total);
    }

    @Get(':id')
    @ApiResponse({ status: 200, description: 'User with specified id', type: AdminUserInfo })
    @ApiResponse({ status: 404, description: 'Cannot find resource with provided parameters' })
    async findById(@Param() request: GetUserById): Promise<AdminUserInfo> {
        const user = await this.userService.findById(request.id);
        return new AdminUserInfo(user);
    }

    @Post()
    @ApiResponse({ status: 201, description: 'Created successfully', type: AdminUserInfo })
    @ApiResponse({ status: 409, description: 'User already exists with those unique parameters' })
    @ApiResponse({ status: 500, description: 'Internal server error during operation' })
    async create(@Body() user: CreateUser): Promise<AdminUserInfo> {
        const createdUser = await this.userService.create(user);
        return new AdminUserInfo(createdUser);
    }

    @Put(':id')
    @ApiResponse({ status: 200, description: 'Patched user with specified id', type: AdminUserInfo })
    @ApiResponse({ status: 404, description: 'Cannot find resource with provided parameters' })
    async update(@Param() params: GetUserById, @Body() request: UpdateUser): Promise<AdminUserInfo> {
        const updatedUser = await this.userService.update(params.id, request);
        return new AdminUserInfo(updatedUser);
    }

    @Delete(':id')
    @ApiResponse({ status: 200, description: 'User successfully deleted' })
    @ApiResponse({ status: 404, description: 'Cannot find resource with provided parameters' })
    delete(@Param() params: GetUserById): Promise<void> {
        return this.userService.delete(params.id);
    }
}
