import { GetUploadersResponse } from '~backend/routes/api/uploaders/dto/get-uploaders-response.dto';
import { TestEnvironment } from '~backend-e2e/test.environment';
import { UploaderEntity } from '~backend/entities/uploader';
import { UploaderInfo } from '~backend/routes/auth/dto/UploaderInfo.dto';

describe('Uploader api (e2e)', () => {
    const env = new TestEnvironment();
    env.init();

    describe('GET /api/uploaders', () => {
        it(
            'should find specified uploader by shikimoriId',
            async () => {
                const shikimoriId = '13371337';
                const [uploaders, total] = await env.dataSource
                    .getRepository(UploaderEntity)
                    .findAndCount({
                        where: { shikimoriId },
                        relations: ['user'],
                    });

                const res = await env.anonClient.getUploaders({ shikimoriId });

                expect(res).toStrictEqual(new GetUploadersResponse(
                    uploaders.map((uploader) => new UploaderInfo(uploader)),
                    20,
                    0,
                    total,
                ));
            },
        );

        it(
            'should find specified uploader by userId',
            async () => {
                const userId = 1;
                const [uploaders, total] = await env.dataSource
                    .getRepository(UploaderEntity)
                    .findAndCount({
                        where: { user: { id: userId } },
                        relations: ['user'],
                    });

                const res = await env.anonClient.getUploaders({ userId });

                expect(res).toStrictEqual(new GetUploadersResponse(
                    uploaders.map((uploader) => new UploaderInfo(uploader)),
                    20,
                    0,
                    total,
                ));
            },
        );

        it(
            'should find banned uploaders',
            async () => {
                const banned = true;
                const [uploaders, total] = await env.dataSource
                    .getRepository(UploaderEntity)
                    .findAndCount({
                        where: { banned },
                        relations: ['user'],
                    });

                const res = await env.anonClient.getUploaders({ banned });

                expect(res.total).toBe(1);
                expect(res).toStrictEqual(new GetUploadersResponse(
                    uploaders.map((uploader) => new UploaderInfo(uploader)),
                    20,
                    0,
                    total,
                ));
            },
        );
    });
});
