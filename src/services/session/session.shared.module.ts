import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SessionEntity } from '@app-entities';
import { SessionService } from '@app-services/session/session.service';

@Module({
    providers: [SessionService],
    imports: [TypeOrmModule.forFeature([SessionEntity])],
    exports: [SessionService],
})
export class SessionSharedModule {}
