import {
    ApiCookieAuth,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { Role } from '@lib-shikicinema';
import { plainToClass } from 'class-transformer';

import { AdminUserInfo } from '@app-routes/api/admin/user/dto/AdminUserInfo.dto';
import { AllowRoles, RoleGuard } from '@app-guards/role.guard';
import {
    CreateUser,
    GetUserById,
    GetUsers,
    UpdateUser,
} from '@app-services/user/dto';
import { UserService } from '@app-services/user/user.service';

@Controller('/')
@AllowRoles(Role.admin)
@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(RoleGuard)
@ApiTags('users (admin)')
@ApiCookieAuth()
@ApiResponse({ status: 403, description: 'Authorized only for admin accounts' })
export class AdminUserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @ApiResponse({ status: 200, description: 'Users list with matched parameters', type: AdminUserInfo, isArray: true })
    async find(@Query() query: GetUsers): Promise<AdminUserInfo[]> {
        const users = await this.userService.findAll(query);
        return plainToClass(AdminUserInfo, users);
    }

    @Get(':id')
    @ApiResponse({ status: 200, description: 'User with specified id', type: AdminUserInfo })
    @ApiResponse({ status: 404, description: 'Cannot find resource with provided parameters' })
    async findById(@Param() id: GetUserById): Promise<AdminUserInfo> {
        const user = await this.userService.findById(id);
        return plainToClass(AdminUserInfo, user);
    }

    @Post()
    @ApiResponse({ status: 201, description: 'Created successfully', type: AdminUserInfo })
    @ApiResponse({ status: 409, description: 'User already exists with those unique parameters' })
    @ApiResponse({ status: 500, description: 'Internal server error during operation' })
    async create(@Body() user: CreateUser): Promise<AdminUserInfo> {
        const createdUser = await this.userService.create(user);
        return plainToClass(AdminUserInfo, createdUser);
    }

    @Put(':id')
    @ApiResponse({ status: 200, description: 'Patched user with specified id', type: AdminUserInfo })
    @ApiResponse({ status: 404, description: 'Cannot find resource with provided parameters' })
    async update(@Param() id: GetUserById, @Body() request: UpdateUser): Promise<AdminUserInfo> {
        const updatedUser = await this.userService.update(id, request);
        return plainToClass(AdminUserInfo, updatedUser);
    }

    @Delete(':id')
    @ApiResponse({ status: 200, description: 'User successfully deleted' })
    @ApiResponse({ status: 404, description: 'Cannot find resource with provided parameters' })
    delete(@Param() id: GetUserById): Promise<void> {
        return this.userService.delete(id);
    }
}
