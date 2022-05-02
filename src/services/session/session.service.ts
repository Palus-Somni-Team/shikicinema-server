import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { SessionEntity } from '@app-entities';

@Injectable()
export class SessionService {
    constructor(
        @InjectRepository(SessionEntity)
        private readonly repository: Repository<SessionEntity>
    ) {}

    findById(id: string) {
        return this.repository.findOneBy({ id });
    }

    async revokeById(sid: string) {
        const session = await this.findById(sid);
        session.expiredAt = Date.now();
        return this.repository.save(session);
    }
}
