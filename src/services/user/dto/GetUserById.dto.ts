import { Exclude, Expose, Type } from 'class-transformer';
import { GetByIdParamRequest } from '@lib-shikicinema';
import { IsInt, Min } from 'class-validator';

@Exclude()
export class GetUserById implements GetByIdParamRequest {
    @Expose()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    id: number;
}
