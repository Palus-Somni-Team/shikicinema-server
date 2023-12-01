import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseController } from '~backend/routes/base.controller';
import { Body, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import {
    CreateVideoRequestRequest,
    GetVideoRequestsRequest,
    GetVideoRequestsResponse,
    VideoRequest,
} from '~backend/routes/api/requests/video/dto';
import { IRequest } from '~backend/routes/auth/dto/IRequest.dto';
import { UploadTokenGuard } from '~backend/guards/upload-token.guard';
import { VideoRequestService } from '~backend/services/requests/video/video-requests.service';

@ApiTags('video requests')
export class VideoRequestsController extends BaseController {
    constructor(protected readonly videoRequestService: VideoRequestService) {
        super();
    }

    @Get()
    @ApiResponse({ status: 200, description: 'Video requests found by query params', type: GetVideoRequestsResponse })
    async search(@Query() query: GetVideoRequestsRequest): Promise<GetVideoRequestsResponse> {
        query.limit ??= 20;
        query.offset ??= 0;

        const [entities, total] = await this.videoRequestService.get(query.limit,
            query.offset,
            query.id,
            query.types,
            query.statuses,
            query.createdBy,
            query.reviewedBy);

        return new GetVideoRequestsResponse(
            entities.map((_) => new VideoRequest(_)),
            query.limit,
            query.offset,
            total,
        );
    }

    @Post()
    @UseGuards(UploadTokenGuard)
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Create request for a specified video', type: VideoRequest })
    async create(@Req() req: IRequest, @Body() request: CreateVideoRequestRequest): Promise<VideoRequest> {
        const entity = await this.videoRequestService.create(
            req.user,
            request.videoId,
            request.type,
            request.episode,
            request.kind,
            request.quality,
            request.language,
            request.author,
            request.comment);
        return new VideoRequest(entity);
    }
}
