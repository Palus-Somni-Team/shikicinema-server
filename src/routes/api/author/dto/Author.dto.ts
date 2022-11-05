import { ApiProperty } from '@nestjs/swagger';
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
}
