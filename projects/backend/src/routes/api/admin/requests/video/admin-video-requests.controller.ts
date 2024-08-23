import { AllowRoles, RoleGuard } from '~backend/guards/role.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    ApproveVideoRequestRequest,
    RejectVideoRequestRequest,
} from '~backend/routes/api/admin/requests/video/dto';
import { BaseController } from '~backend/routes/base.controller';
import { Body, Patch, Req, UseGuards } from '@nestjs/common';
import { IRequest } from '~backend/routes/auth/dto/IRequest.dto';
import { Role } from '@shikicinema/types';
import { VideoRequest } from '~backend/routes/api/requests/video/dto';
import { VideoRequestService } from '~backend/services/requests/video/video-requests.service';

@ApiTags('Video requests (admin)')
@AllowRoles(Role.admin)
@UseGuards(RoleGuard)
export class AdminVideoRequestsController extends BaseController {
    constructor(protected readonly videoRequestService: VideoRequestService) {
        super();
    }

    @Patch('reject')
    @ApiResponse({ status: 200, description: 'Reject specified request' })
    async cancel(@Req() req: IRequest, @Body() body: RejectVideoRequestRequest): Promise<VideoRequest> {
        const entity = await this.videoRequestService.reject(req.user, body.id, body.comment);
        return new VideoRequest(entity);
    }

    @Patch('approve')
    @ApiResponse({ status: 200, description: 'Approve specified request' })
    async approve(@Req() req: IRequest, @Body() body: ApproveVideoRequestRequest): Promise<VideoRequest> {
        const entity = await this.videoRequestService.approve(req.user, body.id, body.comment);
        return new VideoRequest(entity);
    }
}
