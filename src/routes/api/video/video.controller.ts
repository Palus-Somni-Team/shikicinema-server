import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { GetByIdParamRequest } from '@lib-shikicinema';

import { BaseController } from '@app-routes/base.controller';
import {
    CreateVideoRequest,
    GetVideosInfoRequest,
    GetVideosRequest,
    SearchVideosRequest,
} from '@app-routes/api/video/dto';
import { IRequest } from '@app-routes/auth/dto/IRequest';
import { UploadTokenGuard } from '@app/guards/upload-token.guard';
import { VideoService } from '@app-services/video/video.service';

@Controller()
export class VideoController extends BaseController {
    constructor(protected readonly videoService: VideoService) {
        super();
    }

    @Get()
    async findByAnime(@Query() { animeId, episode }: GetVideosRequest) {
        return this.videoService.findByAnimeId(animeId, episode);
    }

    @Get('search')
    async search(@Query() query: SearchVideosRequest) {
        return this.videoService.search(query);
    }

    @Get('info')
    async getInfo(@Query() request: GetVideosInfoRequest) {
        return this.videoService.getInfo(request.animeId);
    }

    @Post()
    @UseGuards(UploadTokenGuard)
    async create(@Req() req: IRequest, @Body() request: CreateVideoRequest) {
        return this.videoService.create(req.user, request);
    }

    @Patch(':id/watch')
    async watch(@Param() params: GetByIdParamRequest) {
        return this.videoService.incrementWatches(params.id);
    }
}
