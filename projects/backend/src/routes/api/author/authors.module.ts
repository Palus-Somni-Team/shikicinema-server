import { AuthorController } from '~backend/routes/api/author/author.controller';
import { AuthorSharedModule } from '~backend/services/author/author.shared.module';
import { Module } from '@nestjs/common';

@Module({
    imports: [AuthorSharedModule],
    controllers: [AuthorController],
})
export class AuthorModule {}
