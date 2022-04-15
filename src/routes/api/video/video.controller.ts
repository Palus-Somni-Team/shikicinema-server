import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';

import { BaseController } from '@app-routes/base.controller';
import { CreateVideoRequest, GetVideosRequest } from './dto';
import { IRequest } from '@app-routes/auth/dto/IRequest';
import { UploadTokenGuard } from '@app/guards/upload-token.guard';
import { VideoService } from '@app-services/video/video.service';

@Controller()
export class VideoController extends BaseController {
    constructor(protected readonly videoService: VideoService) {
        super();
    }

    @Get()
    async find(@Query() request: GetVideosRequest) {
        return this.videoService.find(request.animeId, request.episode);
    }

    @Get(':animeId/info')
    async getInfo(@Param() params: { animeId: number}) {
        return this.videoService.getInfo(params.animeId);
    }

    @Post()
    @UseGuards(UploadTokenGuard)
    async create(@Req() req: IRequest, @Body() request: CreateVideoRequest) {
        return this.videoService.create(req.user, request);
    }
}
