import {
    ApiBody,
    ApiCookieAuth,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
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
import { LoginRequest } from '@app-routes/auth/dto/LoginRequest.dto';
import { OwnerUserInfo } from '@app-routes/auth/dto/OwnerUserInfo';
import { RegisterUser } from '@app-routes/auth/dto/RegisterUser';
import { ShikimoriAccessToken } from '@app-routes/auth/dto/ShikimoriAccessToken';
import { UploadTokenInfo } from '@app-routes/auth/dto/UploadTokenInfo.dto';
import { UploaderInfo } from '@app-routes/auth/dto/UploaderInfo.dto';

@Controller('/')
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @UseGuards(LocalGuard)
    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ApiResponse({ status: 200, description: 'Successfully logged in', type: OwnerUserInfo })
    @ApiResponse({ status: 401, description: 'Login failed: wrong credentials' })
    @ApiBody({ type: LoginRequest })
    async login(@Req() req: IRequest): Promise<OwnerUserInfo> {
        const user = await this.authService.getLoggedInUser(req);
        return plainToClass(OwnerUserInfo, user);
    }

    @UseGuards(AuthenticatedGuard)
    @Get('me')
    @ApiCookieAuth()
    @ApiResponse({ status: 200, description: 'Currently logged in user information', type: OwnerUserInfo })
    @ApiResponse({ status: 403, description: 'Should login first to access this endpoint' })
    async me(@Req() req: IRequest): Promise<OwnerUserInfo> {
        const user = await this.authService.getLoggedInUser(req);
        return plainToClass(OwnerUserInfo, user);
    }

    @UseGuards(AuthenticatedGuard)
    @HttpCode(HttpStatus.OK)
    @Post('logout')
    @ApiCookieAuth()
    @ApiResponse({ status: 200, description: 'Successfully logged out' })
    @ApiResponse({ status: 403, description: 'Should login first to access this endpoint' })
    @ApiResponse({ status: 500, description: 'Internal server error during operation' })
    logout(@Req() req: IRequest): Promise<void> {
        return this.authService.logout(req);
    }

    @Post('register')
    @ApiResponse({ status: 201, description: 'Registered successfully', type: OwnerUserInfo })
    @ApiResponse({ status: 409, description: 'User already exists with those unique parameters' })
    @ApiResponse({ status: 500, description: 'Internal server error during operation' })
    async register(@Req() req: IRequest, @Body() user: RegisterUser): Promise<OwnerUserInfo> {
        const newUser = await this.authService.register(user);
        return plainToClass(OwnerUserInfo, newUser);
    }

    @Post('uploader')
    @ApiResponse({ status: 201, description: 'New uploader created successfully', type: UploaderInfo })
    @ApiResponse({ status: 400, description: 'Invalid or expired Shikimori token' })
    async newUploader(@Req() req: IRequest, @Body() shikimoriToken: ShikimoriAccessToken) {
        const newUploader = await this.authService.newUploader(req, shikimoriToken);
        return plainToClass(UploaderInfo, newUploader);
    }

    @HttpCode(HttpStatus.OK)
    @Post('upload-token')
    @ApiResponse({ status: 200, description: 'New upload token created successfully', type: UploadTokenInfo })
    @ApiResponse({ status: 400, description: 'Invalid or expired Shikimori token' })
    @ApiResponse({ status: 404, description: 'You should register a new uploader first' })
    async createUploadToken(@Body() shikimoriToken: ShikimoriAccessToken) {
        const token = await this.authService.createUploadToken(shikimoriToken);
        return plainToClass(UploadTokenInfo, token);
    }
}
