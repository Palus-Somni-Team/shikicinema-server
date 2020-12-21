import { Exclude, Expose } from 'class-transformer';
import { TransformRoles } from '@utils/class-transform.utils';
import { Role } from '@shikicinema';

@Exclude()
export class OwnerUserInfo {
  @Expose()
  id: number;

  @Expose()
  login: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  @TransformRoles()
  roles: Role[];

  @Expose()
  shikimoriId: string | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}