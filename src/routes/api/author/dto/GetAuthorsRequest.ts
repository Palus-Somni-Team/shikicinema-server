import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';
import { GetAuthorsRequest as Request } from '@lib-shikicinema';

export class GetAuthorsRequest implements Request {
    @Expose()
    @IsString()
    @Length(1, 256)
    @IsOptional()
    @ApiProperty({ required: false })
    name?: string;

    @Expose()
    @IsInt()
    @IsOptional()
    @Min(0)
    @ApiProperty({
        minimum: 0,
        required: false,
    })
    offset?: number;

    @Expose()
    @IsInt()
    @IsOptional()
    @Min(1)
    @Max(100)
    @ApiProperty({
        minimum: 1,
        maximum: 100,
        required: false,
    })
    limit?: number;
}
