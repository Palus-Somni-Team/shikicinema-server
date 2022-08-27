import { CreateVideoRequest, VideoKindEnum, VideoQualityEnum } from '@lib-shikicinema';
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
                    author: expect.any(String),
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
                .findOneBy({ animeId, episode });

            expect(createVideoRes).toEqual(
                expect.objectContaining({
                    animeId: video.animeId,
                    episode: video.episode,
                    language: video.language,
                    author: video.author,
                    kind: +video.kind,
                    quality: +video.quality,
                    url: video.url,
                    id: expect.any(Number),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    watchesCount: 0,
                    uploader: expect.objectContaining({
                        id: expect.any(Number),
                        banned: expect.any(Boolean),
                        shikimoriId: expect.any(String),
                    }),
                }),
            );
        },
    );

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

    it(
        'should return 200 OK GET /api/videos/search',
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
        'should return 200 OK & empty array GET /api/videos/search',
        async () => {
            const shikimoriId = '404404404';
            const res = await env.anonClient.searchVideo({ uploader: shikimoriId });
            expect(res).toStrictEqual([]);
        },
    );
});
