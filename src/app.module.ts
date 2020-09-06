import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AdminUserModule } from './admin-user/admin-user.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UserModule, AdminUserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
