import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Get, Post, Query, Req } from '@nestjs/common';

import { BaseController } from '~backend/routes/base.controller';
import { GetUploadersRequest, GetUploadersResponse } from '~backend/routes/api/uploaders/dto';
import { IRequest } from '~backend/routes/auth/dto/IRequest.dto';
import { ShikimoriAccessToken } from '~backend/routes/auth/dto/ShikimoriAccessToken.dto';
import { UploaderInfo } from '~backend/routes/auth/dto/UploaderInfo.dto';
import { UploaderService } from '~backend/services/uploader/uploader.service';

@ApiTags('uploaders')
export class UploadersController extends BaseController {
    constructor(protected readonly uploaderService: UploaderService) {
        super();
    }

    @Post()
    @ApiResponse({ status: 201, description: 'New uploader created successfully', type: UploaderInfo })
    @ApiResponse({ status: 400, description: 'Invalid or expired Shikimori token' })
    async newUploader(@Req() req: IRequest, @Body() shikimoriToken: ShikimoriAccessToken): Promise<UploaderInfo> {
        const newUploader = await this.uploaderService.newUploader(req, shikimoriToken);
        return new UploaderInfo(newUploader);
    }

    @Get()
    @ApiResponse({ status: 200, description: 'search uploaders by userId or shikimoriId', type: GetUploadersResponse })
    async search(@Query() query: GetUploadersRequest): Promise<GetUploadersResponse> {
        query.limit ??= 20;
        query.offset ??= 0;

        const [uploaders, total] = await this.uploaderService.findAll(
            query.userId,
            query.shikimoriId,
            query.banned,
            query.offset,
            query.limit
        );

        return new GetUploadersResponse(
            uploaders.map((uploader) => new UploaderInfo(uploader)),
            query.limit,
            query.offset,
            total,
        );
    }
}
