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
import { GetByIdParamRequest, Role } from '@lib-shikicinema';
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
export class AdminUserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async find(@Query() query: GetUsers): Promise<AdminUserInfo[]> {
        const users = await this.userService.findAll(query);
        return plainToClass(AdminUserInfo, users);
    }

    @Get(':id')
    async findById(@Param() id: GetUserById): Promise<AdminUserInfo> {
        const user = await this.userService.findById(id);
        return plainToClass(AdminUserInfo, user);
    }

    @Post()
    async create(@Body() user: CreateUser): Promise<AdminUserInfo> {
        const createdUser = await this.userService.create(user);
        return plainToClass(AdminUserInfo, createdUser);
    }

    @Put(':id')
    async update(@Param() id: GetByIdParamRequest, @Body() request: UpdateUser): Promise<AdminUserInfo> {
        const updatedUser = await this.userService.update(id, request);
        return plainToClass(AdminUserInfo, updatedUser);
    }

    @Delete(':id')
    delete(@Param() id: GetUserById): Promise<void> {
        return this.userService.delete(id);
    }
}
