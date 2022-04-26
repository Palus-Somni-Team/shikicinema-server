import { CreateVideoRequest, VideoKindEnum } from '@lib-shikicinema';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, Transaction } from 'typeorm';

import { AlreadyExistsException } from '@app-utils/exceptions/already-exists.exception';
import { AnimeEpisodeInfo } from '@app-routes/api/video/dto/AnimeEpisodeInfo.dto';
import { RawAnimeEpisodeInfoInterface } from '@app-routes/api/video/types/raw-anime-episode-info.interface';
import { UpdateVideoRequest } from '@app-routes/api/admin/video/dto';
import { UploaderService } from '@app-services/uploader/uploader.service';
import { VideoEntity } from '@app-entities';

@Injectable()
export class VideoService {
    constructor(
        @InjectRepository(VideoEntity)
        private readonly repository: Repository<VideoEntity>,
        private readonly uploaderService: UploaderService,
    ) {}

    @Transaction()
    async create(uploaderId: number, video: CreateVideoRequest): Promise<VideoEntity> {
        const uploader = await this.uploaderService.getByUploaderId(uploaderId);
        let entity = await this.repository.findOne({ where: { url: video.url } });

        if (entity) {
            throw new AlreadyExistsException();
        } else {
            entity = new VideoEntity(
                video.animeId,
                video.episode,
                video.url,
                video.kind,
                video.language,
                video.quality,
                video.author,
                uploader,
            );

            entity = await this.repository.save(entity);
        }

        return entity;
    }

    async update(id: number, video: UpdateVideoRequest): Promise<VideoEntity> {
        let entity = await this.repository.findOne({
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

        entity = await this.repository.save(entity);

        return entity;
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
        const rawEpisodes: RawAnimeEpisodeInfoInterface[] = await this.repository
            .createQueryBuilder()
            .select(['episode', 'kind', 'url'])
            .distinct(true)
            .where('anime_id = :animeId', { animeId })
            .getRawMany();
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

            kinds.add(+kind);
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
