import { DevAssert } from '~backend/utils/checks/dev/dev-assert';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { VideoRequestEntity } from '~backend/entities';
import { VideoRequestStatusEnum, VideoRequestTypeEnum } from '@shikicinema/types';
import { toSqlWhere } from '~backend/utils/postgres.utils';

@Injectable()
export class VideoRequestService {
    constructor(
        @InjectRepository(VideoRequestEntity)
        private readonly repository: Repository<VideoRequestEntity>,
    ) { }

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
        });
    }
}
