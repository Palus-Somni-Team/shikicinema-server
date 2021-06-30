import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@app-entities';
import { UserService } from './user.service';

@Module({
    providers: [UserService],
    imports: [TypeOrmModule.forFeature([UserEntity])],
    exports: [UserService],
})
export class UserSharedModule {}
