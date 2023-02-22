import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { GetByIdParamRequest } from '@lib-shikicinema';
import { IsInt, Min } from 'class-validator';

@Exclude()
export class GetVideoById implements GetByIdParamRequest {
    @Expose()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    @ApiProperty({ minimum: 0 })
    id: number;
}