import {createSelector} from '@ngrx/store';
import { IAuthState } from './auth.state';
import { AdminUser } from '@shikicinema/types';

export const selectAuthState = (state: any): IAuthState => {
  return state.auth;
};

export const selectAuthUser = createSelector(
  selectAuthState,
  (authState: IAuthState): AdminUser | undefined => {
    return authState.me;
  }
);
