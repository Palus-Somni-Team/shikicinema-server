import { AuthorEntity } from '~backend/entities/author';
import { AuthorService } from '~backend/services/author/author.service';
import { DataSource, Repository } from 'typeorm';
import { DevAssert } from '~backend/utils/checks/dev/dev-assert';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { UploaderEntity, UserEntity, VideoEntity, VideoRequestEntity } from '~backend/entities';
import { UserAssert } from '~backend/utils/checks/user/user-assert';
import { VideoKindEnum, VideoQualityEnum, VideoRequestStatusEnum, VideoRequestTypeEnum } from '@shikicinema/types';
import { toSqlWhere } from '~backend/utils/postgres.utils';

@Injectable()
export class VideoRequestService {
    constructor(
        @InjectRepository(VideoRequestEntity)
        private readonly repository: Repository<VideoRequestEntity>,
        private readonly dataSource: DataSource,
        private readonly authorService: AuthorService,
    ) {
    }

    get(
        limit: number,
        offset: number,
        id?: number,
        types?: VideoRequestTypeEnum[],
        statuses?: VideoRequestStatusEnum[],
        createdBy?: number,
        reviewedBy?: number,
    ): Promise<[VideoRequestEntity[], number]> {
        DevAssert.check('limit', limit).notNullish().greaterOrEqualTo(1).lessOrEqualTo(100);
        DevAssert.check('offset', offset).notNullish().greaterOrEqualTo(0);

        const where = toSqlWhere({
            id,
            status: statuses,
            type: types,
            createdBy: createdBy ? { id: createdBy } : createdBy,
            reviewedBy: reviewedBy ? { id: reviewedBy } : reviewedBy,
        });

        return this.repository.findAndCount({
            where,
            skip: offset,
            take: limit,
            order: { id: 'desc' },
            relations: ['video', 'author', 'createdBy', 'reviewedBy'],
            withDeleted: true,
        });
    }

    async create(
        createdById: number,
        videoId: number,
        type: VideoRequestTypeEnum,
        episode?: number,
        kind?: VideoKindEnum,
        quality?: VideoQualityEnum,
        language?: string,
        author?: string,
        comment?: string,
    ): Promise<VideoRequestEntity> {
        return this.dataSource.transaction(async (entityManager) => {
            const uploaderRepo = await entityManager.getRepository(UploaderEntity);
            const videoRepo = await entityManager.getRepository(VideoEntity);

            const video = await videoRepo.findOne({ where: { id: videoId } });
            UserAssert.check('video', video).exists();

            let authorEntity: AuthorEntity;
            if (author) {
                authorEntity = await this.authorService.getOrCreateAuthorEntity(entityManager, author);
            }

            const uploader = await uploaderRepo.findOne({ where: { id: createdById } });

            let reqEntity = new VideoRequestEntity(
                type,
                VideoRequestStatusEnum.ACTIVE,
                episode,
                kind,
                quality,
                language,
                comment,
                null,
                video,
                authorEntity,
                uploader,
                null,
            );

            reqEntity = await entityManager.save(reqEntity);

            return reqEntity;
        });
    }

    async cancel(
        requesterId: number,
        requestId: number,
    ): Promise<void> {
        return this.dataSource.transaction(async (entityManager) => {
            const reqRepo = await entityManager.getRepository(VideoRequestEntity);
            const request = await reqRepo.findOne({ where: { id: requestId }, relations: ['createdBy'] });

            UserAssert.check('request', request).exists();
            UserAssert
                .check('requesterId', requesterId)
                .equals(request.createdBy.id, 'Only request creator can cancel request.');
            UserAssert
                .check('Request status', request.status)
                .equals(VideoRequestStatusEnum.ACTIVE, 'Only active request can be canceled.');

            request.status = VideoRequestStatusEnum.CANCELED;
            await reqRepo.save(request, { reload: false });
        });
    }

    async reject(
        requesterId: number,
        requestId: number,
        comment: string,
    ): Promise<VideoRequestEntity> {
        return this.dataSource.transaction(async (entityManager) => {
            const reqRepo = await entityManager.getRepository(VideoRequestEntity);
            const request = await reqRepo.findOne({
                where: { id: requestId },
            });

            UserAssert.check('request', request).exists();
            UserAssert
                .check('Request status', request.status)
                .equals(VideoRequestStatusEnum.ACTIVE, 'Only active request can be rejected.');

            const userRepo = await entityManager.getRepository(UserEntity);
            const reviewer = await userRepo.findOneBy({ id: requesterId });

            request.status = VideoRequestStatusEnum.REJECTED;
            request.reviewerComment = comment;
            request.reviewedBy = reviewer;

            await reqRepo.save(request, { reload: false });

            return request;
        });
    }

    async approve(
        reviewerId: number,
        requestId: number,
        comment: string,
    ): Promise<VideoRequestEntity> {
        return this.dataSource.transaction(async (entityManager) => {
            const reqRepo = await entityManager.getRepository(VideoRequestEntity);
            const request = await reqRepo.findOne({
                where: { id: requestId },
                relations: ['author', 'video'],
            });

            UserAssert.check('request', request).exists();
            UserAssert
                .check('Request status', request.status)
                .equals(VideoRequestStatusEnum.ACTIVE, 'Only active request can be approved.');
            // video can be marked as deleted at this moment, so we can only cancel or reject request
            UserAssert.check('video', request.video).exists();

            const userRepo = await entityManager.getRepository(UserEntity);
            const reviewer = await userRepo.findOneBy({ id: reviewerId });

            request.status = VideoRequestStatusEnum.APPROVED;
            request.reviewerComment = comment;
            request.reviewedBy = reviewer;

            switch (request.type) {
                case VideoRequestTypeEnum.DELETE:
                    await reqRepo.save(request, { reload: false });
                    const videoRepo = await entityManager.getRepository(VideoEntity);
                    await videoRepo.softDelete(request.video.id);
                    break;
                case VideoRequestTypeEnum.UPDATE:
                    request.video.episode = request.episode ?? request.video.episode;
                    request.video.kind = request.kind ?? request.video.kind;
                    request.video.quality = request.quality ?? request.video.quality;
                    request.video.language = request.language ?? request.video.language;
                    if (request.author) {
                        request.video.author = request.author;
                    }
                    await reqRepo.save(request, { reload: false });
                    break;
                case VideoRequestTypeEnum.INFO:
                    await reqRepo.save(request, { reload: false });
                    break;
                default:
                    throw new Error('Unsupported request type');
            }

            return request;
        });
    }
}
