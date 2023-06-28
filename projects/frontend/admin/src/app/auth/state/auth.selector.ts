import { AdminUser } from '@shikicinema/types';
import { IAuthState } from './auth.state';
import { createSelector } from '@ngrx/store';

export const selectAuthState = (state: any): IAuthState => {
    return state.auth;
};

export const selectAuthUser = createSelector(
    selectAuthState,
    (authState: IAuthState): AdminUser | undefined => {
        return authState.me;
    }
);
