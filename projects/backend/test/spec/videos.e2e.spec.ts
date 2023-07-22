import {
    AnimeEpisodeInfo,
    GetEpisodesResponse,
    GetVideosRequest,
    GetVideosResponse,
    VideoResponse,
} from '~backend/routes/api/video/dto';
import { CreateVideoRequest, VideoKindEnum, VideoQualityEnum } from '@shikicinema/types';
import { Raw } from 'typeorm';
import { TestEnvironment } from '~backend-e2e/test.environment';
import { VideoEntity } from '~backend/entities';
import { normalizeString } from '~backend/utils/postgres.utils';

describe('Videos api (e2e)', () => {
    const env = new TestEnvironment();
    env.init();

    it(
        'should return correct data GET /api/videos',
        async () => {
            const animeId = 1;
            const episode = 1;

            const [videos, total] = await env.dataSource
                .getRepository(VideoEntity)
                .findAndCount({
                    take: 20,
                    skip: 0,
                    where: { animeId, episode },
                    relations: ['uploader', 'author'],
                });

            const res = await env.anonClient.getVideosByEpisode({ animeId, episode });
            expect(res).toStrictEqual(new GetVideosResponse(videos.map((_) => new VideoResponse(_)), 20, 0, total));
        },
    );

    it(
        'should return correct page of videos by animeId GET /api/videos',
        async () => {
            const req = new GetVideosRequest();
            req.animeId = 1;
            req.episode = 3;
            req.limit = 5;
            req.offset = 2;
            const [videos, total] = await env.dataSource
                .getRepository(VideoEntity)
                .findAndCount({
                    take: req.limit,
                    skip: req.offset,
                    where: { animeId: req.animeId, episode: req.episode },
                });

            const res = await env.anonClient.getVideosByEpisode(req);
            expect(res.data.length).toBe(videos.length);
            expect(res.limit).toBe(req.limit);
            expect(res.offset).toBe(req.offset);
            expect(res.total).toBe(total);
        },
    );

    it(
        'should return correct info by animeId GET /api/videos/info',
        async () => {
            const animeId = 1;

            const res = await env.anonClient.getVideoInfo({ animeId });
            expect(res).toStrictEqual(new GetEpisodesResponse([
                new AnimeEpisodeInfo(1, ['admin1.up'], [VideoKindEnum.DUBBING]),
                new AnimeEpisodeInfo(2, ['admin2.up'], [VideoKindEnum.DUBBING]),
                new AnimeEpisodeInfo(3, ['admin3.up'], [VideoKindEnum.DUBBING]),
            ], 20, 0, 3));
        },
    );

    it(
        'should return 200 OK and empty body if cannot found anime with this id GET /api/videos/info',
        async () => {
            const animeId = 404;

            const res = await env.anonClient.getVideoInfo({ animeId });
            expect(res).toStrictEqual(new GetEpisodesResponse([], 20, 0, 0));
        },
    );

    it(
        'should return 201 & create video POST /api/videos',
        async () => {
            const animeId = 12345000;
            const episode = 5;
            const reqBody: CreateVideoRequest = {
                animeId,
                episode,
                language: 'ru',
                author: 'SOME AUTHOR',
                kind: VideoKindEnum.ORIGINAL,
                quality: VideoQualityEnum.WEB,
                url: 'https://test.com/upload_video.mp4',
            };
            const createVideoRes = await env.shikiAuthClient.createVideo(reqBody);
            const video = await env.dataSource
                .getRepository(VideoEntity)
                .findOne({
                    where: { animeId, episode },
                    relations: ['uploader', 'author'],
                });

            expect(video.animeId).toBe(reqBody.animeId);
            expect(video.episode).toBe(reqBody.episode);
            expect(video.author.name).toBe(reqBody.author);
            expect(video.kind).toBe(reqBody.kind);
            expect(video.quality).toBe(reqBody.quality);
            expect(video.url).toBe(reqBody.url);

            expect(createVideoRes).toStrictEqual(new VideoResponse(video));
        },
    );

    it('shouldn\'t create author if it already exists POST /api/videos',
        async () => {
            const animeId = 123123;
            const episode = 123123;
            const reqBody: CreateVideoRequest = {
                animeId,
                episode,
                language: 'ru',
                author: 'some author',
                kind: VideoKindEnum.ORIGINAL,
                quality: VideoQualityEnum.WEB,
                url: 'https://test.com/upload_video.mp4',
            };
            const createVideoRes1 = await env.shikiAuthClient.createVideo(reqBody);

            reqBody.author = reqBody.author.toUpperCase() + ' ';
            const createVideoRes2 = await env.shikiAuthClient.createVideo(reqBody);
            expect(createVideoRes1.author).toStrictEqual(createVideoRes2.author);
        });

    it(
        'should return 409 Already exists POST /api/videos',
        async () => {
            const animeId = 21;
            const episode = 113;
            const reqBody: CreateVideoRequest = {
                animeId,
                episode,
                language: 'ru',
                author: 'SOME AUTHOR',
                kind: VideoKindEnum.ORIGINAL,
                quality: VideoQualityEnum.WEB,
                url: 'https://test.com/upload_video.mp4',
            };
            const createVideoRes = await env.shikiAuthClient.createVideoRaw(reqBody);

            expect(createVideoRes.status).toBe(409);
        },
    );

    it(
        'should return 200 OK PATCH /api/videos/:videoId/watch',
        async () => {
            const animeId = 1;
            const episode = 1;
            const video = await env.dataSource
                .getRepository(VideoEntity)
                .findOneBy({ animeId, episode });

            return env.anonClient.watchVideoRaw(video.id).expect({});
        },
    );

    it(
        'should return 404 Not Found for non-existing video PATCH /api/videos/:videoId/watch',
        async () => {
            const videoId = 404;
            return env.anonClient.watchVideoRaw(videoId).expect(404);
        },
    );

    describe('GET /api/videos/search', () => {
        it(
            'search by uploader returns correct data',
            async () => {
                const shikimoriId = '13371337';
                const [videos, total] = await env.dataSource
                    .getRepository(VideoEntity)
                    .findAndCount({
                        where: { uploader: { shikimoriId } },
                    });

                const res = await env.anonClient.searchVideo({ uploader: shikimoriId });
                expect(res.data.length).toBe(videos.length);
                expect(res.total).toBe(total);
            },
        );

        it(
            'returns empty array when nothing is found',
            async () => {
                const shikimoriId = '404404404';
                const res = await env.anonClient.searchVideo({ uploader: shikimoriId });
                expect(res.data).toStrictEqual([]);
                expect(res.total).toBe(0);
            },
        );

        it(
            'returns correct data on search by author',
            async () => {
                const author = 'anidub';
                const videos = await env.dataSource
                    .getRepository(VideoEntity)
                    .findBy({
                        author: {
                            name: Raw(
                                (_) => `UPPER(${_}) like :author`,
                                { author: `%${normalizeString(author)}%` },
                            ),
                        },
                    });

                const res = await env.anonClient.searchVideo({ author });
                expect(res.data.length).toBe(videos.length);
                expect(res.data.map((_) => _.id)).toStrictEqual(videos.map((_) => _.id));
            },
        );
    });
});
