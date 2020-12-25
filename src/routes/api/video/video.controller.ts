import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';

import { BaseController } from '../../base.controller';
import { CreateVideoRequest, GetVideosRequest } from './dto';
import { IRequest } from '../../auth/dto/IRequest';
import { UploadTokenGuard } from '../../../guards/upload-token.guard';
import { VideoService } from '../../../services/video/video.service';

@Controller()
export class VideoController extends BaseController {
    constructor(protected readonly videoService: VideoService) {
        super();
    }

    @Get()
    async find(@Query() request: GetVideosRequest) {
        return this.videoService.find(request.animeId, request.episode);
    }

    @Post()
    @UseGuards(UploadTokenGuard)
    async create(@Req() req: IRequest, @Body() request: CreateVideoRequest) {
        return this.videoService.create(req.user, request);
    }
}
