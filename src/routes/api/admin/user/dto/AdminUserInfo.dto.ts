import { AdminUser } from '@lib-shikicinema';
import { OwnerUserInfo } from '@app-routes/auth/dto';

export class AdminUserInfo extends OwnerUserInfo implements AdminUser {}
