import { GetByIdParamRequest } from '@shikicinema';
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
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../services/user/user.service';
import { CreateUser, GetUserById, GetUsers, UpdateUser } from '../services/user/dto';
import { AdminUserInfo } from './dto/AdminUserInfo.dto';
import { plainToClass } from 'class-transformer';

@Controller('admin/user')
@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe({ transform: true }))
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
