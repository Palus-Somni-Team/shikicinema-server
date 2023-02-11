import { TestAdminEnvironment } from '@e2e/test.admin.environment';
import { UpdateVideoRequest } from '@app-routes/api/admin/video/dto';
import { VideoEntity } from '@app-entities';
import { VideoKindEnum, VideoQualityEnum } from '@lib-shikicinema';

describe('Admin (e2e)', () => {
    const user1LoginData = { login: 'user1', password: '12345678' };

    const env = new TestAdminEnvironment();
    env.init();

    describe('/USERS', () => {
        it(
            'should not allow to access admin route without proper rights GET /api/admin/user',
            async () => {
                await env.anonClient.login(user1LoginData);

                return env.anonClient.getUsersRaw()
                    .expect(403)
                    .expect({
                        statusCode: 403,
                        message: 'Forbidden resource',
                        error: 'Forbidden',
                    });
            },
        );

        it(
            'should allow to access admin route for admin GET /api/admin/user',
            async () => env.adminClient.getUsers(),
        );
    });

    describe('/VIDEOS', () => {
        const animeId = 21;
        const episode = 113;
        const positivePatchReqBodies: UpdateVideoRequest[] = [
            {},
            { animeId },
            { episode },
            { animeId, episode, author: 'jfhbdfgjbfdgdfgkjdf' },
            { animeId, episode, author: null },
            { animeId, episode, url: 'https://kekeke.lel' },
            { animeId, episode, url: 'http://lelelele.kek' },
            { animeId, episode, kind: VideoKindEnum.DUBBING },
            { animeId, episode, kind: VideoKindEnum.SUBTITLES },
            { animeId, episode, kind: VideoKindEnum.ORIGINAL },
            { animeId, episode, language: 'us' },
            { animeId, episode, language: null },
            { animeId, episode, language: 'ru' },
            { animeId, episode, quality: VideoQualityEnum.BD },
            { animeId, episode, quality: VideoQualityEnum.TV },
            { animeId, episode, quality: VideoQualityEnum.DVD },
            { animeId, episode, quality: VideoQualityEnum.WEB },
            { animeId, episode, quality: VideoQualityEnum.UNKNOWN },
            { animeId, episode, watchesCount: 0 },
            { animeId, episode, watchesCount: 0xDEADBEEF },
        ];
        const negativePatchReqBodies: Partial<UpdateVideoRequest>[] = [
            { animeId, episode: null },
            { animeId: null, episode: null },
            { animeId: -1, episode: -4 },
            { animeId: 3, episode: -1 },
            { animeId: -3, episode: 2 },
            { animeId: 3, episode: NaN },
            { animeId: NaN, episode: 5 },
            { animeId: NaN, episode: NaN },
            { animeId: 3, episode: Infinity },
            { animeId: Infinity, episode: 5 },
            { animeId: Infinity, episode: Infinity },
            { animeId, episode, watchesCount: null },
            { animeId, episode, watchesCount: -5 },
            { animeId, episode, watchesCount: NaN },
            { animeId, episode, watchesCount: Infinity },
            { animeId, episode, url: null },
            { animeId, episode, kind: null },
        ];

        for (const [index, patchReqBody] of negativePatchReqBodies.entries()) {
            const patchReqAsText = JSON.stringify(patchReqBody);

            it(
                `should return 400 Bad Request #${index} ${patchReqAsText} PATCH /api/admin/videos/:videoId`,
                async () => {
                    const video = await env.dataSource
                        .getRepository(VideoEntity)
                        .findOne({
                            where: { animeId, episode },
                            relations: ['uploader'],
                        });

                    return env.adminClient.updateVideoRaw(video.id, patchReqBody).expect(400);
                },
            );
        }

        for (const [index, patchReqBody] of positivePatchReqBodies.entries()) {
            const patchReqAsText = JSON.stringify(patchReqBody);

            it(
                `should return 200 OK & update video #${index} ${patchReqAsText} PATCH /api/admin/videos/:videoId`,
                async () => {
                    const video = await env.dataSource
                        .getRepository(VideoEntity)
                        .findOne({
                            where: { animeId, episode },
                            relations: ['uploader', 'author'],
                        });

                    const res = await env.adminClient.updateVideo(video.id, patchReqBody);
                    expect(res).toEqual(expect.objectContaining({
                        id: video.id,
                        animeId: patchReqBody.animeId ?? video.animeId,
                        author: expect.objectContaining({
                            name: patchReqBody.author ?? video.author.name,
                        }),
                        episode: patchReqBody.episode ?? video.episode,
                        kind: patchReqBody.kind ?? video.kind,
                        language: patchReqBody.language ?? video.language,
                        quality: patchReqBody.quality ?? video.quality,
                        uploader: {
                            shikimoriId: video.uploader.shikimoriId,
                            banned: video.uploader.banned,
                            id: video.uploader.id,
                        },
                        url: patchReqBody.url ?? video.url,
                        watchesCount: patchReqBody.watchesCount ?? video.watchesCount,
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                    }));
                },
            );
        }

        it(
            'should return 404 Not Found PATCH /api/admin/videos/:videoId',
            async () => env.adminClient.updateVideoRaw(0xDEAD_BEEF, {}).expect(404),
        );

        it(
            'should return 404 Not Found GET /api/admin/videos/:videoId',
            async () => env.adminClient.getVideoRaw(0xDEAD_BEEF).expect(404),
        );

        it(
            'should find video and return in format GET /api/admin/videos/:videoId',
            async () => {
                const video = await env.dataSource
                    .getRepository(VideoEntity)
                    .findOne({
                        where: { animeId: 21, episode: 113 },
                        relations: ['uploader', 'author'],
                    });

                const res = await env.adminClient.getVideo(video.id);
                expect(res).toStrictEqual({
                    animeId: video.animeId,
                    episode: video.episode,
                    url: video.url,
                    kind: video.kind,
                    language: video.language,
                    quality: video.quality,
                    author: {
                        id: video.author.id,
                        name: video.author.name,
                    },
                    uploader: {
                        shikimoriId: video.uploader.shikimoriId,
                        banned: video.uploader.banned,
                        id: video.uploader.id,
                    },
                    watchesCount: video.watchesCount,
                    id: video.id,
                    createdAt: video.createdAt.toISOString(),
                    updatedAt: video.updatedAt.toISOString(),
                });
            },
        );

        it(
            'should delete video DELETE /api/admin/videos/:videoId',
            async () => {
                const video = await env.dataSource
                    .getRepository(VideoEntity)
                    .findOneBy({ animeId: 21, episode: 113 });

                return env.adminClient.deleteVideo(video.id);
            },
        );
    });
});
