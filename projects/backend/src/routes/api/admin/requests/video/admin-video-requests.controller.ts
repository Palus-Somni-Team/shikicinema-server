import { AllowRoles, RoleGuard } from '~backend/guards/role.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseController } from '~backend/routes/base.controller';
import { Body, Patch, Req, UseGuards } from '@nestjs/common';
import { IRequest } from '~backend/routes/auth/dto/IRequest.dto';
import {
    RejectVideoRequestRequest,
} from '~backend/routes/api/admin/requests/video/dto';
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
}
