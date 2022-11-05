import { AuthorController } from '@app-routes/api/author/author.controller';
import { AuthorSharedModule } from '@app-services/author/author.shared.module';
import { Module } from '@nestjs/common';

@Module({
    imports: [AuthorSharedModule],
    controllers: [AuthorController],
})
export class AuthorModule {}
