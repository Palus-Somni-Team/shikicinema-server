import { ClassSerializerInterceptor, Controller, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';

@Controller('/')
@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe({ transform: true }))
export abstract class BaseController {}
