import { CreateVideoRequest, VideoKindEnum } from '@lib-shikicinema';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, getManager } from 'typeorm';

import { AlreadyExistsException } from '@app-utils/exceptions/already-exists.exception';
import { AnimeEpisodeInfo } from '@app-routes/api/video/dto/AnimeEpisodeInfo.dto';
import { RawAnimeEpisodeInfoInterface } from '@app-routes/api/video/types/raw-anime-episode-info.interface';
import { UpdateVideoRequest } from '@app-routes/api/admin/video/dto';
import { UploaderEntity, VideoEntity } from '@app-entities';

@Injectable()
export class VideoService {
    constructor(
        @InjectRepository(VideoEntity)
        private readonly repository: Repository<VideoEntity>,
    ) {}

    async create(uploaderId: number, video: CreateVideoRequest): Promise<VideoEntity> {
        return getManager().transaction(async (entityManager) => {
            const uploaderRepo = await entityManager.getRepository(UploaderEntity);
            const videoRepo = await entityManager.getRepository(VideoEntity);

            const uploaderEntity = await uploaderRepo.findOne(uploaderId);
            let videoEntity = await videoRepo.findOne({ where: { url: video.url } });

            if (videoEntity) {
                throw new AlreadyExistsException();
            } else {
                videoEntity = new VideoEntity(
                    video.animeId,
                    video.episode,
                    video.url,
                    video.kind,
                    video.language,
                    video.quality,
                    video.author,
                    uploaderEntity,
                );

                return videoRepo.save(videoEntity);
            }
        });
    }

    async update(id: number, video: UpdateVideoRequest): Promise<VideoEntity> {
        return getManager().transaction(async (entityManager) => {
            const videoRepo = await entityManager.getRepository(VideoEntity);

            const entity = await videoRepo.findOne({
                where: { id },
                relations: ['uploader'],
            });

            if (!entity) {
                throw new NotFoundException();
            }

            entity.episode = video?.episode ?? entity.episode;
            entity.url = video.url ?? entity.url;
            entity.kind = video.kind ?? entity.kind;
            entity.language = video.language ?? entity.language;
            entity.quality = video.quality ?? entity.quality;
            entity.author = video.author ?? entity.author;
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
            relations: ['uploader'],
        });

        if (!video) {
            throw new NotFoundException();
        }

        return video;
    }

    async find(animeId: number, episode?: number): Promise<VideoEntity[]> {
        return this.repository.find({
            where: { animeId, episode },
            relations: ['uploader'],
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

        if (rawEpisodes.length === 0) {
            throw new NotFoundException();
        }

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
}
