import { GetByIdParamRequest } from '@shikicinema';
import { IsInt, Min } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class GetUserById implements GetByIdParamRequest {
  @Expose()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  id: number;
}
