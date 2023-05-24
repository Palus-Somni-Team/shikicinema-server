import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseController } from '~backend/routes/base.controller';
import { Get, Query } from '@nestjs/common';
import {
    GetVideoRequestsRequest,
    GetVideoRequestsResponse,
    VideoRequest,
} from '~backend/routes/api/requests/video/dto';
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
            total
        );
    }
}
