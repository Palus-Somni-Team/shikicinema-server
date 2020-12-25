import { Body, Delete, Param, Put, UseGuards } from '@nestjs/common';
import { Role } from '@lib-shikicinema';

import { AllowRoles, RoleGuard } from '../../../../guards/role.guard';
import { UpdateVideoRequest } from './dto';
import { VideoController } from '../../video/video.controller';
import { VideoResponse } from '../../video/dto';


@UseGuards(RoleGuard)
@AllowRoles(Role.admin)
export class AdminVideoController extends VideoController {
    @Put(':id')
    async update(@Param() videoId: number, @Body() request: UpdateVideoRequest): Promise<VideoResponse> {
        const video = await this.videoService.update(videoId, request);
        return new VideoResponse(video);
    }

    @Delete(':id')
    async remove(@Param() videoId: number): Promise<void> {
        await this.videoService.delete(videoId);
    }
}
