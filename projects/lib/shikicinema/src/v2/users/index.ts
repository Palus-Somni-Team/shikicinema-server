import { DataResponse } from '../DataResponse';
import { AdminUser } from './AdminUser';
import { User } from './User';

export type GetUsersResponse = DataResponse<User>;

export type GetAdminUsersResponse = DataResponse<AdminUser>;

export * from './AdminUser';
export * from './CreateUserRequest';
export * from './GetUsersRequest';
export * from './RegisterUserRequest';
export * from './Role';
export * from './UpdateUserRequest';
export * from './User';
