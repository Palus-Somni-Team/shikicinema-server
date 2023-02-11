import { Between, DataSource, EntityManager, Raw, Repository } from 'typeorm';
import { CreateVideoRequest, VideoKindEnum, VideoQualityEnum } from '@lib-shikicinema';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { AlreadyExistsException } from '@app-utils/exceptions/already-exists.exception';
import { AnimeEpisodeInfo } from '@app-routes/api/video/dto';
import { Assert } from '@app-utils/validation/assert';
import { AuthorEntity, UploaderEntity, VideoEntity } from '@app-entities';
import { UpdateVideoRequest } from '@app-routes/api/admin/video/dto';
import { normalizeString, removeUndefinedWhereFields } from '@app-utils/postgres.utils';

@Injectable()
export class VideoService {
    constructor(
        @InjectRepository(VideoEntity)
        private readonly repository: Repository<VideoEntity>,
        private readonly dataSource: DataSource,
    ) {}

    async create(uploaderId: number, video: CreateVideoRequest): Promise<VideoEntity> {
        return this.dataSource.transaction(async (entityManager) => {
            const uploaderRepo = await entityManager.getRepository(UploaderEntity);
            const videoRepo = await entityManager.getRepository(VideoEntity);

            const uploaderEntity = await uploaderRepo.findOneBy({ id: uploaderId });
            let videoEntity = await videoRepo.findOneBy({ url: video.url });

            if (videoEntity) {
                throw new AlreadyExistsException();
            } else {
                const authorEntity = await this.getOrCreateAuthorEntity(entityManager, video.author);

                videoEntity = new VideoEntity(
                    video.animeId,
                    video.episode,
                    video.url,
                    video.kind,
                    video.language,
                    video.quality,
                    authorEntity,
                    uploaderEntity,
                );

                return videoRepo.save(videoEntity);
            }
        });
    }

    async update(id: number, video: UpdateVideoRequest): Promise<VideoEntity> {
        return this.dataSource.transaction(async (entityManager) => {
            const videoRepo = await entityManager.getRepository(VideoEntity);

            const entity = await videoRepo.findOne({
                where: { id },
                relations: ['uploader', 'author'],
            });

            if (!entity) {
                throw new NotFoundException();
            }

            if (video.author && normalizeString(video.author) !== normalizeString(entity.author.name)) {
                const authorEntity = await this.getOrCreateAuthorEntity(entityManager, video.author);
                entity.author = authorEntity;
            }

            entity.animeId = video?.animeId ?? entity.animeId;
            entity.episode = video?.episode ?? entity.episode;
            entity.url = video.url ?? entity.url;
            entity.kind = video.kind ?? entity.kind;
            entity.language = video.language ?? entity.language;
            entity.quality = video.quality ?? entity.quality;
            entity.watchesCount = video.watchesCount ?? entity.watchesCount;

            return videoRepo.save(entity);
        });
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete({ id });
    }

    async findById(id: number): Promise<VideoEntity> {
        const video = await this.repository.findOne({
            where: { id },
            relations: ['uploader', 'author'],
        });

        if (!video) {
            throw new NotFoundException();
        }

        return video;
    }

    async findByAnimeId(
        limit: number,
        offset: number,
        animeId: number,
        episode: number
    ): Promise<[VideoEntity[], number]> {
        Assert.Argument('limit', limit).between(1, 100);
        Assert.Argument('offset', offset).greaterOrEqualTo(0);
        Assert.Argument('animeId', animeId).greaterOrEqualTo(0);
        Assert.Argument('episode', episode).greaterOrEqualTo(1);

        return this.repository.findAndCount({
            where: { animeId, episode },
            take: limit,
            skip: offset,
            relations: ['uploader', 'author'],
        });
    }

    async search(
        limit: number,
        offset: number,
        id?: number,
        animeId?: number,
        author?: string,
        episode?: number,
        kind?: VideoKindEnum,
        language?: string,
        quality?: VideoQualityEnum,
        uploader?: string,
    ): Promise<[VideoEntity[], number]> {
        Assert.Argument('limit', limit).between(1, 100);
        Assert.Argument('offset', offset).greaterOrEqualTo(0);

        const where = removeUndefinedWhereFields({ id, animeId, episode, kind, language, quality });

        if (uploader !== undefined) {
            const shikimoriId = uploader;
            where['uploader'] = { shikimoriId };
        }

        if (author !== undefined) {
            where['author'] = {
                name: Raw(
                    (_) => `UPPER(${_}) like :author`, { author: `%${normalizeString(author)}%` }
                ),
            };
        }

        return this.repository.findAndCount({
            where,
            skip: offset,
            take: limit,
            relations: ['uploader', 'author'],
        });
    }

    async getInfo(animeId: number, limit: number, offset: number): Promise<[AnimeEpisodeInfo[], number]> {
        Assert.Argument('limit', limit).between(1, 100);
        Assert.Argument('offset', offset).greaterOrEqualTo(0);

        return this.dataSource.transaction(async (manager) => {
            const repo = manager.getRepository(VideoEntity);
            const total = await repo.createQueryBuilder()
                .distinct(true)
                .setFindOptions({ where: { animeId } })
                .getCount();
            const episodes = (await repo.createQueryBuilder()
                .distinct(true)
                .setFindOptions({
                    take: limit,
                    skip: offset,
                    order: { episode: 'asc' },
                    select: { episode: true },
                    where: { animeId },
                })
                .getMany()).map((_) => _.episode);
            const rawInfo = await this.repository
                .createQueryBuilder()
                .distinct(true)
                .setFindOptions({
                    select: { episode: true, kind: true, url: true },
                    where: {
                        animeId,
                        episode: Between(episodes[0], episodes[episodes.length - 1]),
                    },
                })
                .getMany();

            const kindsMap = new Map<number, Set<VideoKindEnum>>();
            const domainsMap = new Map<number, Set<string>>();

            for (const { episode, kind, url } of rawInfo) {
                const domain = new URL(url).hostname;
                let kinds = kindsMap.get(episode);
                let domains = domainsMap.get(episode);

                if (!kinds) {
                    const epKinds = new Set<VideoKindEnum>();

                    kindsMap.set(episode, epKinds);
                    kinds = epKinds;
                }

                if (!domains) {
                    const epDomains = new Set<string>();

                    domainsMap.set(episode, epDomains);
                    domains = epDomains;
                }

                kinds.add(kind);
                domains.add(domain);
            }

            return [
                episodes.map(
                    (_) => new AnimeEpisodeInfo(_, Array.from(domainsMap.get(_)), Array.from(kindsMap.get(_)))
                ),
                total,
            ];
        });
    }

    async incrementWatches(id: number): Promise<void> {
        const { affected } = await this.repository.increment({ id }, 'watchesCount', 1);

        if (affected === 0) {
            throw new NotFoundException();
        }
    }

    private async getOrCreateAuthorEntity(entityManager: EntityManager, author: string): Promise<AuthorEntity> {
        const authorRepo = await entityManager.getRepository(AuthorEntity);
        const entity = await authorRepo.findOneBy({
            name: Raw((_) => `UPPER(${_}) = :name`, { name: normalizeString(author) }),
        });

        return entity ?? new AuthorEntity(author);
    }
}
