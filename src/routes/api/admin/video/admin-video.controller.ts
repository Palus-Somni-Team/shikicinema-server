import { Body, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { GetByIdParamRequest, Role } from '@lib-shikicinema';
import { plainToClass } from 'class-transformer';

import { AllowRoles, RoleGuard } from '@app/guards/role.guard';
import { UpdateVideoRequest } from './dto';
import { VideoController } from '@app-routes/api/video/video.controller';
import { VideoResponse } from '@app-routes/api/video/dto';


@UseGuards(RoleGuard)
@AllowRoles(Role.admin)
export class AdminVideoController extends VideoController {
    @Get(':id')
    async getById(@Param() params: GetByIdParamRequest): Promise<VideoResponse> {
        const video = await this.videoService.findById(params.id);

        return plainToClass(VideoResponse, video);
    }

    @Patch(':id')
    async update(
        @Param() params: GetByIdParamRequest,
            @Body() request: UpdateVideoRequest,
    ): Promise<VideoResponse> {
        const video = await this.videoService.update(params.id, request);

        return plainToClass(VideoResponse, video);
    }

    @Delete(':id')
    async remove(@Param() params: GetByIdParamRequest): Promise<void> {
        await this.videoService.delete(params.id);
    }
}
