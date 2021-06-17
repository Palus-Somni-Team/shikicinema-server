import { Module } from '@nestjs/common';
import { UploaderService } from './uploader.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploaderEntity } from '@app-entities';
import { UserSharedModule } from '../user/user.shared.module';

@Module({
    imports: [
        UserSharedModule,
        TypeOrmModule.forFeature([UploaderEntity]),
    ],
    providers: [UploaderService],
    exports: [UploaderService],
})
export class UploaderSharedModule {}
