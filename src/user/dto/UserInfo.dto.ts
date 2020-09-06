import { Exclude, Expose } from 'class-transformer';
import { User } from '@shikicinema';

@Exclude()
export class UserInfo implements User {
  @Expose()
  id: number;

  @Expose()
  login: string;

  @Expose()
  name: string;

  @Expose()
  shikimoriId: string | null;
}
