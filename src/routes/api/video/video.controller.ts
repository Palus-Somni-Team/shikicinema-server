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

import { AnimeEpisodeInfoSchema } from '@app-routes/api/video/schemas/anime-episode-info.schema';
import { BaseController } from '@app-routes/base.controller';
import {
    CreateVideoRequest,
    GetEpisodesRequest,
    GetEpisodesResponse,
    GetVideoById,
    GetVideosRequest,
    GetVideosResponse,
    SearchVideosRequest,
    VideoResponse,
} from '@app-routes/api/video/dto';
import { IRequest } from '@app-routes/auth/dto';
import { UploadTokenGuard } from '@app/guards/upload-token.guard';
import { VideoService } from '@app-services/video/video.service';

@Controller()
@ApiTags('videos')
export class VideoController extends BaseController {
    constructor(
        protected readonly videoService: VideoService,
    ) {
        super();
    }

    @Get()
    @ApiResponse({ status: 200, description: 'Videos by animeId and episode', type: GetVideosResponse, isArray: true })
    async findByAnime(@Query() query: GetVideosRequest): Promise<GetVideosResponse> {
        const limit = query.limit ?? 20;
        const offset = query.offset ?? 0;
        const [videos, total] = await this.videoService.findByAnimeId(limit, offset, query.animeId, query.episode);
        return new GetVideosResponse(videos.map((video) => new VideoResponse(video)), limit, offset, total);
    }

    @Get('search')
    @ApiResponse({ status: 200, description: 'Videos with matched parameters', type: VideoResponse, isArray: true })
    async search(@Query() query: SearchVideosRequest): Promise<GetVideosResponse> {
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
            query.uploader
        );

        return new GetVideosResponse(videos.map((video) => new VideoResponse(video)), limit, offset, total);
    }

    @Get('info')
    @ApiResponse({ status: 200, description: 'Anime episodes info', schema: AnimeEpisodeInfoSchema })
    async getInfo(@Query() request: GetEpisodesRequest): Promise<GetEpisodesResponse> {
        const limit = request.limit ?? 20;
        const offset = request.offset ?? 0;
        const [data, total] = await this.videoService.getInfo(request.animeId, limit, offset);
        return new GetEpisodesResponse(data, limit, offset, total);
    }

    @Post()
    @UseGuards(UploadTokenGuard)
    @ApiBearerAuth()
    @ApiResponse({ status: 201, description: 'Successfully uploaded', type: VideoResponse })
    @ApiResponse({ status: 409, description: 'Video with this URL already exists' })
    async create(@Req() req: IRequest, @Body() request: CreateVideoRequest): Promise<VideoResponse> {
        const video = await this.videoService.create(req.user, request);
        return new VideoResponse(video);
    }

    @Patch(':id/watch')
    @ApiResponse({ status: 200, description: 'Watch counter incremented' })
    @ApiResponse({ status: 404, description: 'Cannot find resource with provided parameters' })
    async watch(@Param() params: GetVideoById): Promise<void> {
        return this.videoService.incrementWatches(params.id);
    }
}
