import { ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { Role } from '@shikicinema/types';

import { AllowRoles, RoleGuard } from '~backend/guards/role.guard';
import { GetVideoById, VideoResponse } from '~backend/routes/api/video/dto';
import { UpdateVideoRequest } from '~backend/routes/api/admin/video/dto';
import { VideoController } from '~backend/routes/api/video/video.controller';


@UseGuards(RoleGuard)
@AllowRoles(Role.admin)
@ApiTags('videos (admin)')
@ApiCookieAuth()
export class AdminVideoController extends VideoController {
    @Get(':id')
    @ApiResponse({ status: 200, description: 'Video with specified id', type: VideoResponse })
    @ApiResponse({ status: 404, description: 'Cannot find resource with provided parameters' })
    async getById(@Param() params: GetVideoById): Promise<VideoResponse> {
        const video = await this.videoService.findById(params.id);

        return new VideoResponse(video);
    }

    @Patch(':id')
    @ApiResponse({ status: 200, description: 'Patched video with specified id', type: VideoResponse })
    @ApiResponse({ status: 404, description: 'Cannot find resource with provided parameters' })
    async update(
        @Param() params: GetVideoById,
        @Body() request: UpdateVideoRequest,
    ): Promise<VideoResponse> {
        const video = await this.videoService.update(params.id, request);

        return new VideoResponse(video);
    }

    @Delete(':id')
    @ApiResponse({ status: 200, description: 'Video successfully deleted' })
    @ApiResponse({ status: 404, description: 'Cannot find resource with provided parameters' })
    async remove(@Param() params: GetVideoById): Promise<void> {
        await this.videoService.delete(params.id);
    }
}
