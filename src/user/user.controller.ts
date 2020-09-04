import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Body, Controller } from '@nestjs/common';

@ApiBearerAuth()
@ApiTags('users')
@Controller()
export class UserController {
  async create(@Body('user') userData) {

  }
}
