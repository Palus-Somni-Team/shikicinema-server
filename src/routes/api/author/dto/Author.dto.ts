import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Author as Interface } from '@lib-shikicinema';

export class Author implements Interface {
    @Expose()
    @ApiProperty()
    id: number;

    @Expose()
    @ApiProperty()
    name: string;
}
