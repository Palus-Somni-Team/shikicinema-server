import { ApiProperty } from '@nestjs/swagger';
import { AuthorEntity } from '@app-entities';
import { Exclude, Expose } from 'class-transformer';
import { Author as Interface } from '@lib-shikicinema';

@Exclude()
export class Author implements Interface {
    @Expose()
    @ApiProperty()
    id: number;

    @Expose()
    @ApiProperty()
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    public static create(author: AuthorEntity): Author {
        return new Author(author.id, author.name);
    }
}
