import { Exclude, Expose } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';

@Exclude()
export class ShikimoriAccessToken {
  @Expose()
  @IsString()
  @MinLength(10)
  token: string;
}
