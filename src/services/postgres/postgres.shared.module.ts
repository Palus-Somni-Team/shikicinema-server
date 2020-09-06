import { Module } from '@nestjs/common';
import { PgSharedService } from './postgres.service';

@Module({
  providers: [PgSharedService],
  exports: [PgSharedService]
})
export class PostgresSharedModule {}
