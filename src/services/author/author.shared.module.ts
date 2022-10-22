import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthorEntity } from '@app-entities';
import { AuthorService } from '@app-services/author/author.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([AuthorEntity]),
    ],
    providers: [
        AuthorService,
    ],
    exports: [AuthorService],
})
export class AuthorSharedModule {}
