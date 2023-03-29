import { AdminUser } from '@shikicinema/types';
import { OwnerUserInfo } from '~backend/routes/auth/dto';

export class AdminUserInfo extends OwnerUserInfo implements AdminUser {}
