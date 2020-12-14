import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../guards/authenticated.guard';
import { LocalGuard } from '../guards/local.guard';
import { AuthService } from './auth.service';
import { IRequest } from './dto/IRequest';
import { plainToClass } from 'class-transformer';
import { OwnerUserInfo } from './dto/OwnerUserInfo';
import { RegisterUser } from './dto/RegisterUser';
import { UploadTokenInfo } from './dto/UploadTokenInfo.dto';
import { ShikimoriAccessToken } from './dto/ShikimoriAccessToken';
import { UploaderInfo } from './dto/UploaderInfo.dto';

@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Req() req: IRequest): Promise<OwnerUserInfo> {
    const user = await this.authService.getLoggedInUser(req);
    return plainToClass(OwnerUserInfo, user);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('me')
  async me(@Req() req: IRequest): Promise<OwnerUserInfo> {
    const user = await this.authService.getLoggedInUser(req);
    return plainToClass(OwnerUserInfo, user);
  }

  @UseGuards(AuthenticatedGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Req() req: IRequest): Promise<void> {
    return this.authService.logout(req);
  }

  @Post('register')
  async register(@Req() req: IRequest, @Body() user: RegisterUser): Promise<OwnerUserInfo> {
    const newUser = await this.authService.register(user);
    return plainToClass(OwnerUserInfo, newUser)
  }

  @Post('uploader')
  async newUploader(@Req() req: IRequest, @Body() shikimoriToken: ShikimoriAccessToken) {
    const newUploader = await this.authService.newUploader(req, shikimoriToken);
    return plainToClass(UploaderInfo, newUploader);
  }

  @HttpCode(HttpStatus.OK)
  @Post('upload-token')
  async createUploadToken(@Body() shikimoriToken: ShikimoriAccessToken) {
    const token = await this.authService.createUploadToken(shikimoriToken);
    return plainToClass(UploadTokenInfo, token)
  }
}
