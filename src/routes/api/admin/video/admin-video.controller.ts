import { Body, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { Role } from '@lib-shikicinema';

import { AllowRoles, RoleGuard } from '@app/guards/role.guard';
import { UpdateVideoRequest } from './dto';
import { VideoController } from '@app-routes/api/video/video.controller';
import { VideoResponse } from '@app-routes/api/video/dto';


@UseGuards(RoleGuard)
@AllowRoles(Role.admin)
export class AdminVideoController extends VideoController {
    @Get(':id')
    async getById(@Param() videoId: number): Promise<VideoResponse> {
        const video = await this.videoService.findById(videoId);
        return new VideoResponse(video);
    }

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
