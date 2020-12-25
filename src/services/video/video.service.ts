import { AlreadyExistsException } from '@app-utils/exceptions/already-exists.exception';
import { CreateVideoRequest } from '@lib-shikicinema';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, Transaction } from 'typeorm';
import { VideoEntity } from '@app-entities';

import { UpdateVideoRequest } from '../../routes/api/admin/video/dto';
import { UploaderService } from '../uploader/uploader.service';

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

    @Transaction()
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

    async find(animeId: number, episode?: number): Promise<VideoEntity[]> {
        return this.repository.find({
            where: { animeId, episode },
            relations: ['uploader'],
        });
    }
}
