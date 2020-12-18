import { Role } from '@shikicinema';

export interface OwnerUserInfo {
  id: number;
  login: string;
  name: string;
  email: string;
  roles: Role[];
  shikimoriId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
