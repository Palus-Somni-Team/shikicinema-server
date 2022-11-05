import { CreateVideoRequest, VideoKindEnum } from '@lib-shikicinema';
import { DataSource, EntityManager, Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { AlreadyExistsException } from '@app-utils/exceptions/already-exists.exception';
import { AnimeEpisodeInfo, SearchVideosRequest } from '@app-routes/api/video/dto';
import { AuthorEntity, UploaderEntity, VideoEntity } from '@app-entities';
import { RawAnimeEpisodeInfoInterface } from '@app-routes/api/video/types/raw-anime-episode-info.interface';
import { UpdateVideoRequest } from '@app-routes/api/admin/video/dto';
import { normalizeString } from '@app-utils/postgres.utils';
import { parseWhere } from '@app-utils/where-parser.utils';

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

    async findByAnimeId(animeId: number, episode: number): Promise<VideoEntity[]> {
        return this.repository.find({
            where: { animeId, episode },
            relations: ['uploader', 'author'],
        });
    }

    async search(query: SearchVideosRequest): Promise<VideoEntity[]> {
        const { where, limit, offset } = parseWhere(query);

        if ('uploader' in where) {
            const shikimoriId = where['uploader'];

            where['uploader'] = { shikimoriId };
        }

        if ('author' in where) {
            const name = where['author'];

            where['author'] = {
                name: Raw(
                    (_) => `UPPER(${_}) like :author`, { author: `%${normalizeString(name)}%` }
                ),
            };
        }

        return this.repository.find({
            where,
            skip: offset ?? 0,
            take: limit || 20,
            relations: ['uploader', 'author'],
        });
    }

    async getInfo(animeId: number): Promise<AnimeEpisodeInfo> {
        const animeEpisodeInfo: AnimeEpisodeInfo = {};
        const rawEpisodes = await this.repository
            .createQueryBuilder()
            .select(['episode', 'kind', 'url'])
            .distinct(true)
            .where('anime_id = :animeId', { animeId })
            .getRawMany<RawAnimeEpisodeInfoInterface>();
        const kindsMap = new Map<number, Set<VideoKindEnum>>();
        const domainsMap = new Map<number, Set<string>>();
        const episodes = new Set<number>(
            rawEpisodes.map((ep) => ep.episode)
        );

        for (const { episode, kind, url } of rawEpisodes) {
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

        for (const ep of episodes) {
            animeEpisodeInfo[ep] = {
                kinds: [...kindsMap.get(ep)],
                domains: [...domainsMap.get(ep)],
            };
        }

        return animeEpisodeInfo;
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
