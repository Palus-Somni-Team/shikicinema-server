import { CreateVideoRequest, VideoKindEnum, VideoQualityEnum } from '@lib-shikicinema';
import { Raw } from 'typeorm';
import { TestEnvironment } from '@e2e/test.environment';
import { VideoEntity } from '@app-entities';

describe('Videos api (e2e)', () => {
    const env = new TestEnvironment();
    env.init();

    it(
        'should return video in correct format GET /api/videos',
        async () => {
            const animeId = 1;
            const episode = 1;

            const res = await env.anonClient.getVideosByEpisode({ animeId, episode });
            for (const video of res) {
                expect(video).toEqual(expect.objectContaining({
                    animeId, episode,
                    id: expect.any(Number),
                    author: expect.objectContaining({
                        id: expect.any(Number),
                        name: expect.any(String),
                    }),
                    url: expect.any(String),
                    kind: expect.any(Number),
                    quality: expect.any(Number),
                    language: expect.any(String),
                    watchesCount: expect.any(Number),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    uploader: expect.objectContaining({
                        id: expect.any(Number),
                        banned: expect.any(Boolean),
                        shikimoriId: expect.any(String),
                    }),
                }));
            }
        },
    );

    it(
        'should return all videos by animeId GET /api/videos',
        async () => {
            const animeId = 1;
            const episode = 3;
            const videos = await env.dataSource
                .getRepository(VideoEntity)
                .find({ where: { animeId, episode } });

            const res = await env.anonClient.getVideosByEpisode({ animeId, episode });
            expect(res.length).toBe(videos.length);
        },
    );

    it(
        'should return correct info by animeId GET /api/videos/info',
        async () => {
            const animeId = 1;

            const res = await env.anonClient.getVideosInfo({ animeId });
            expect(res).toStrictEqual({
                1: { kinds: [VideoKindEnum.DUBBING], domains: ['admin1.up'] },
                2: { kinds: [VideoKindEnum.DUBBING], domains: ['admin2.up'] },
                3: { kinds: [VideoKindEnum.DUBBING], domains: ['admin3.up'] },
            });
        },
    );

    it(
        'should return 200 OK and empty body if cannot found anime with this id GET /api/videos/info',
        async () => {
            const animeId = 404;

            const res = await env.anonClient.getVideosInfo({ animeId });
            expect(res).toStrictEqual({});
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
                author: 'some author',
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

            expect(createVideoRes).toEqual(
                expect.objectContaining({
                    animeId: reqBody.animeId,
                    episode: reqBody.episode,
                    language: reqBody.language,
                    author: expect.objectContaining({
                        id: video.author.id,
                        name: reqBody.author,
                    }),
                    kind: +reqBody.kind,
                    quality: +reqBody.quality,
                    url: reqBody.url,
                    id: video.id,
                    createdAt: video.createdAt.toISOString(),
                    updatedAt: video.updatedAt.toISOString(),
                    watchesCount: 0,
                    uploader: expect.objectContaining({
                        id: video.uploader.id,
                        banned: video.uploader.banned,
                        shikimoriId: video.uploader.shikimoriId,
                    }),
                }),
            );
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
                author: 'some author',
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
                const videos = await env.dataSource
                    .getRepository(VideoEntity)
                    .find({
                        where: { uploader: { shikimoriId } },
                    });

                const res = await env.anonClient.searchVideo({ uploader: shikimoriId });
                expect(res.length).toBe(videos.length);
            },
        );

        it(
            'returns empty array when nothing is found',
            async () => {
                const shikimoriId = '404404404';
                const res = await env.anonClient.searchVideo({ uploader: shikimoriId });
                expect(res).toStrictEqual([]);
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
                                (_) =>`UPPER(${_}) like :author`,
                                { author: `%${author.trim().toUpperCase()}%` },
                            ),
                        },
                    });

                const res = await env.anonClient.searchVideo({ author });
                expect(res.length).toBe(videos.length);
                expect(res.map((_) => _.id)).toStrictEqual(videos.map((_) => _.id));
            },
        );
    });
});
