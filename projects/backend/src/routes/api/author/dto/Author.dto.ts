import { ApiProperty } from '@nestjs/swagger';
import { AuthorEntity } from '~backend/entities';
import { Exclude, Expose } from 'class-transformer';
import { Author as Interface } from '@shikicinema/types';

@Exclude()
export class Author implements Interface {
    @Expose()
    @ApiProperty()
        id: number;

    @Expose()
    @ApiProperty()
        name: string;

    constructor(author?: AuthorEntity) {
        if (!author) return;

        const { id, name } = author;

        this.id = id;
        this.name = name;
    }
}
