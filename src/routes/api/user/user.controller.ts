import { ApiTags } from '@nestjs/swagger';
import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    Param,
    Query,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { GetUserById, GetUsers } from '@app-services/user/dto';
import { UserInfo } from '@app-routes/api/user/dto/UserInfo.dto';
import { UserService } from '@app-services/user/user.service';

@Controller('/')
@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async find(@Query() query: GetUsers): Promise<UserInfo[]> {
        const users = await this.userService.findAll(query);
        return plainToClass(UserInfo, users);
    }

    @Get(':id')
    async findById(@Param() id: GetUserById): Promise<UserInfo> {
        const user = await this.userService.findById(id);
        return plainToClass(UserInfo, user);
    }
}
