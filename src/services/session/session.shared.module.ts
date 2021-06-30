import { Module } from '@nestjs/common';
import { SessionEntity } from '@app-entities';
import { SessionService } from './session.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    providers: [SessionService],
    imports: [TypeOrmModule.forFeature([SessionEntity])],
    exports: [SessionService],
})
export class SessionSharedModule {}
