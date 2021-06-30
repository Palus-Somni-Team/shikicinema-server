import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploaderEntity } from '@app-entities';
import { UploaderService } from './uploader.service';
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
