import { AdminUser } from '@shikicinema/types';

export interface IAuthState {
    me: AdminUser | undefined;
}

export const initialAuthState: IAuthState = {
    me: undefined,
};
