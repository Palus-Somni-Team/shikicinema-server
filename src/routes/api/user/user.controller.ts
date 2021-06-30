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
import { GetUserById, GetUsers } from '../../../services/user/dto';
import { UserInfo } from './dto/UserInfo.dto';
import { UserService } from '../../../services/user/user.service';
import { plainToClass } from 'class-transformer';

@Controller('/')
@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe({ transform: true }))
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
