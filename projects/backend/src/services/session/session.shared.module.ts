import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SessionEntity } from '~backend/entities';
import { SessionService } from '~backend/services/session/session.service';

@Module({
    providers: [SessionService],
    imports: [TypeOrmModule.forFeature([SessionEntity])],
    exports: [SessionService],
})
export class SessionSharedModule {}
