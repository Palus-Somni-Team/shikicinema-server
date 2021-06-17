import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from '@app-entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    providers: [UserService],
    imports: [TypeOrmModule.forFeature([UserEntity])],
    exports: [UserService],
})
export class UserSharedModule {}
