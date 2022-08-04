import {
    ApiBearerAuth,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
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
import { plainToClass } from 'class-transformer';

import { AnimeEpisodeInfoSchema } from '@app-routes/api/video/schemas/anime-episode-info.schema';
import { BaseController } from '@app-routes/base.controller';
import {
    CreateVideoRequest,
    GetVideoById,
    GetVideosInfoRequest,
    GetVideosRequest,
    SearchVideosRequest,
    VideoResponse,
} from '@app-routes/api/video/dto';
import { IRequest } from '@app-routes/auth/dto/IRequest';
import { UploadTokenGuard } from '@app/guards/upload-token.guard';
import { VideoService } from '@app-services/video/video.service';

@Controller()
@ApiTags('videos')
export class VideoController extends BaseController {
    constructor(protected readonly videoService: VideoService) {
        super();
    }

    @Get()
    @ApiResponse({ status: 200, description: 'Videos by animeId and episode', type: VideoResponse, isArray: true })
    async findByAnime(@Query() { animeId, episode }: GetVideosRequest) {
        const videos = await this.videoService.findByAnimeId(animeId, episode);

        return videos.map((video) => plainToClass(VideoResponse, video));
    }

    @Get('search')
    @ApiResponse({ status: 200, description: 'Videos with matched parameters', type: VideoResponse, isArray: true })
    async search(@Query() query: SearchVideosRequest) {
        const videos = await this.videoService.search(query);

        return videos.map((video) => plainToClass(VideoResponse, video));
    }

    @Get('info')
    @ApiResponse({ status: 200, description: 'Anime episodes info', schema: AnimeEpisodeInfoSchema })
    async getInfo(@Query() request: GetVideosInfoRequest) {
        return this.videoService.getInfo(request.animeId);
    }

    @Post()
    @UseGuards(UploadTokenGuard)
    @ApiBearerAuth()
    @ApiResponse({ status: 201, description: 'Successfully uploaded', type: VideoResponse })
    @ApiResponse({ status: 409, description: 'Video with this URL already exists' })
    async create(@Req() req: IRequest, @Body() request: CreateVideoRequest) {
        const video = await this.videoService.create(req.user, request);

        return plainToClass(VideoResponse, video);
    }

    @Patch(':id/watch')
    @ApiResponse({ status: 200, description: 'Watch counter incremented' })
    @ApiResponse({ status: 404, description: 'Cannot find resource with provided parameters' })
    async watch(@Param() params: GetVideoById) {
        return this.videoService.incrementWatches(params.id);
    }
}
