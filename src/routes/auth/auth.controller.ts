import { AuthService } from '@app-routes/auth/auth.service';
import { AuthenticatedGuard } from '@app/guards/authenticated.guard';
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
import { plainToClass } from 'class-transformer';

import { IRequest } from '@app-routes/auth/dto/IRequest';
import { LocalGuard } from '@app-guards/local.guard';
import { OwnerUserInfo } from '@app-routes/auth/dto/OwnerUserInfo';
import { RegisterUser } from '@app-routes/auth/dto/RegisterUser';
import { ShikimoriAccessToken } from '@app-routes/auth/dto/ShikimoriAccessToken';
import { UploadTokenInfo } from '@app-routes/auth/dto/UploadTokenInfo.dto';
import { UploaderInfo } from '@app-routes/auth/dto/UploaderInfo.dto';

@Controller('/')
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
        return plainToClass(OwnerUserInfo, newUser);
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
        return plainToClass(UploadTokenInfo, token);
    }
}
