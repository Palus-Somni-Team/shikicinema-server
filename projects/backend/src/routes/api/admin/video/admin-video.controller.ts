import { ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Role } from '@shikicinema/types';

import {
    AdminGetVideosResponse,
    AdminSearchVideosRequest,
    AdminVideoResponse,
    UpdateVideoRequest,
} from '~backend/routes/api/admin/video/dto';
import { AllowRoles, RoleGuard } from '~backend/guards/role.guard';
import { GetVideoById } from '~backend/routes/api/video/dto';
import { VideoController } from '~backend/routes/api/video/video.controller';


@UseGuards(RoleGuard)
@AllowRoles(Role.admin)
@ApiTags('videos (admin)')
@ApiCookieAuth()
export class AdminVideoController extends VideoController {
    @Get('search')
    @ApiResponse({
        status: 200,
        description: 'Videos with matched parameters',
        type: AdminVideoResponse,
        isArray: true,
    })
    override async search(@Query() query: AdminSearchVideosRequest): Promise<AdminGetVideosResponse> {
        const limit = query.limit ?? 20;
        const offset = query.offset ?? 0;

        const [videos, total] = await this.videoService.search(
            limit,
            offset,
            query.id,
            query.animeId,
            query.author,
            query.episode,
            query.kind,
            query.language,
            query.quality,
            query.uploader,
            query.includeDeleted,
        );

        return new AdminGetVideosResponse(videos.map((video) => new AdminVideoResponse(video)), limit, offset, total);
    }

    @Get(':id')
    @ApiResponse({ status: 200, description: 'Video with specified id', type: AdminVideoResponse })
    @ApiResponse({ status: 404, description: 'Cannot find resource with provided parameters' })
    async getById(@Param() params: GetVideoById): Promise<AdminVideoResponse> {
        const video = await this.videoService.findById(params.id);

        return new AdminVideoResponse(video);
    }

    @Patch(':id')
    @ApiResponse({ status: 200, description: 'Patched video with specified id', type: AdminVideoResponse })
    @ApiResponse({ status: 404, description: 'Cannot find resource with provided parameters' })
    async update(
        @Param() params: GetVideoById,
        @Body() request: UpdateVideoRequest,
    ): Promise<AdminVideoResponse> {
        const video = await this.videoService.update(params.id, request);

        return new AdminVideoResponse(video);
    }

    @Delete(':id')
    @ApiResponse({ status: 200, description: 'Video successfully deleted' })
    async remove(@Param() params: GetVideoById): Promise<void> {
        await this.videoService.delete(params.id);
    }

    @Post('deleted/:id')
    @ApiResponse({ status: 200, description: 'Video successfully marked as deleted' })
    async softDelete(@Param() params: GetVideoById): Promise<void> {
        await this.videoService.softDelete(params.id);
    }

    @Delete('deleted/:id')
    @ApiResponse({ status: 200, description: 'Marked as deleted video restored' })
    async restore(@Param() params: GetVideoById): Promise<void> {
        await this.videoService.restore(params.id);
    }
}
