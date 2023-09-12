import { PatchUploaderRequest } from '~backend/routes/api/admin/uploaders/dto/patch-uploader-request.dto';
import { TestAdminEnvironment } from '~backend-e2e/test.admin.environment';
import { UpdateVideoRequest } from '~backend/routes/api/admin/video/dto';
import { UploaderInfo } from '~backend/routes/auth/dto/UploaderInfo.dto';
import { VideoEntity } from '~backend/entities';
import { VideoKindEnum, VideoQualityEnum } from '@shikicinema/types';
import { VideoResponse } from '~backend/routes/api/video/dto';
import { plainToInstance } from 'class-transformer';

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
            { animeId, episode, author: 'UPDATED' },
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
                    // arrange
                    const video = await env.dataSource
                        .getRepository(VideoEntity)
                        .findOne({
                            where: { animeId, episode },
                            relations: ['uploader', 'author'],
                        });

                    // act
                    const res = await env.adminClient.updateVideo(video.id, patchReqBody);

                    // assert
                    expect(res.animeId).toBe(patchReqBody.animeId ?? video.animeId);
                    expect(res.author.name).toBe(patchReqBody.author ?? video.author.name);
                    expect(res.episode).toBe(patchReqBody.episode ?? video.episode);
                    expect(res.kind).toBe(patchReqBody.kind ?? video.kind);
                    expect(res.language).toBe(patchReqBody.language ?? video.language);
                    expect(res.quality).toBe(patchReqBody.quality ?? video.quality);
                    expect(res.url).toBe(patchReqBody.url ?? video.url);
                    expect(res.watchesCount).toBe(patchReqBody.watchesCount ?? video.watchesCount);
                    expect(res.updatedAt.getTime() - Date.now()).toBeLessThan(1000);
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
            'should find video and return correct data GET /api/admin/videos/:videoId',
            async () => {
                const video = await env.dataSource
                    .getRepository(VideoEntity)
                    .findOne({
                        where: { animeId: 21, episode: 113 },
                        relations: ['uploader', 'author'],
                    });

                const res = await env.adminClient.getVideo(video.id);
                expect(res).toStrictEqual(new VideoResponse(video));
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

    describe('/UPLOADERS', () => {
        const positivePatchReqBodies: Array<[number, PatchUploaderRequest, UploaderInfo]> = [
            [
                5,
                { banned: true },
                plainToInstance(UploaderInfo, { id: 5, banned: true, shikimoriId: 'has-no-user-1', userId: null }),
            ],
            [
                6,
                { banned: false },
                plainToInstance(UploaderInfo, { id: 6, banned: false, shikimoriId: 'has-no-user-2', userId: null }),
            ],
            [
                7,
                { userId: 3 },
                plainToInstance(UploaderInfo, { id: 7, banned: false, shikimoriId: 'has-no-user-3', userId: 3 }),
            ],
            [
                8,
                { userId: 5, shikimoriId: 'has-user' },
                plainToInstance(UploaderInfo, { id: 8, banned: false, shikimoriId: 'has-user', userId: 5 }),
            ],
            [
                9,
                { userId: 6, shikimoriId: 'has-user-1', banned: true },
                plainToInstance(UploaderInfo, { id: 9, banned: true, shikimoriId: 'has-user-1', userId: 6 }),
            ],
            [
                10,
                { userId: 7, shikimoriId: 'has-user-2', banned: true },
                plainToInstance(UploaderInfo, { id: 10, banned: true, shikimoriId: 'has-user-2', userId: 7 }),
            ],
            [
                11,
                { shikimoriId: 'other-user' },
                plainToInstance(UploaderInfo, { id: 11, banned: false, shikimoriId: 'other-user', userId: null }),
            ],
            [
                12,
                { shikimoriId: 'other-user-1', banned: true },
                plainToInstance(UploaderInfo, { id: 12, banned: true, shikimoriId: 'other-user-1', userId: null }),
            ],
        ];

        const negativePatchReqBodies: Partial<PatchUploaderRequest>[] = [
            {},
        ];

        for (const [index, [uploaderId, positiveReqBody, expected]] of positivePatchReqBodies.entries()) {
            it(
                `should update uploader #${index} PATCH /api/admin/uploaders/:id`,
                async () => {
                    const res = await env.adminClient.updateUploader(uploaderId, positiveReqBody);

                    expect(res).toStrictEqual(expected);
                },
            );
        }
    });
});
