import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionService } from './session.service';
import { SessionEntity } from './session.entity';

@Module({
  providers: [SessionService],
  imports: [TypeOrmModule.forFeature([SessionEntity])],
  exports: [SessionService],
})
export class SessionSharedModule {}
