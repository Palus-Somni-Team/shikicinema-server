import { AdminVideoResponse, UpdateVideoRequest } from '~backend/routes/api/admin/video/dto';
import { TestAdminEnvironment } from '~backend-e2e/test.admin.environment';
import { VideoEntity } from '~backend/entities';
import { VideoKindEnum, VideoQualityEnum } from '@shikicinema/types';

describe('Admin Videos (e2e)', () => {
    const env = new TestAdminEnvironment();
    env.init();

    //#region Update video tests
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

    //#endregion Update video tests

    //#region Get video tests

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
                    // video is marked as deleted in seeds
                    where: { animeId: 404, episode: 404 },
                    relations: ['uploader', 'author'],
                    withDeleted: true,
                });

            const res = await env.adminClient.getVideo(video.id);
            expect(res).toStrictEqual(new AdminVideoResponse(video));
        },
    );

    //#endregion Get video tests

    //#region Delete video tests

    it(
        'DELETE /api/admin/videos/:videoId video should be deleted',
        async () => {
            const video = await env.dataSource
                .getRepository(VideoEntity)
                .findOneBy({ animeId: 21, episode: 113 });

            // act
            await env.adminClient.deleteVideo(video.id);

            // assert
            const res = await env.dataSource
                .getRepository(VideoEntity)
                .findOneBy({ animeId: 21, episode: 113 });
            expect(res).toBeNull();
        },
    );

    it(
        'POST /api/admin/videos/deleted/:videoId video should be marked as deleted',
        async () => {
            let video = await env.dataSource
                .getRepository(VideoEntity)
                .findOneBy({ animeId: 1, episode: 1 });

            // act
            await env.adminClient.softDeleteVideo(video.id);
            const res = await env.adminClient.getVideo(video.id);

            // assert
            video = await env.dataSource
                .getRepository(VideoEntity)
                .findOne({
                    where: { id: video.id },
                    relations: ['uploader', 'author'],
                    withDeleted: true,
                });

            expect(video.deletedAt).toBeTruthy();
            expect(res).toStrictEqual(new AdminVideoResponse(video));
        },
    );

    it(
        'DELETE /api/admin/videos/deleted/:videoId video should be restored',
        async () => {
            let video = await env.dataSource
                .getRepository(VideoEntity)
                // video is marked as deleted in seeds
                .findOne({
                    where: { animeId: 404, episode: 404 },
                    relations: ['uploader', 'author'],
                    withDeleted: true,
                });

            // act
            await env.adminClient.restoreVideo(video.id);

            // assert
            video = await env.dataSource
                .getRepository(VideoEntity)
                .findOne({ where: { id: video.id } });
            expect(video).not.toBeNull();
            expect(video.deletedAt).toBeNull();
        },
    );

    //#endregion Delete video tests
});
