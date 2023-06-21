import {createReducer, on} from '@ngrx/store';
import { AuthAction } from './auth.action';
import { IAuthState, initialAuthState } from './auth.state';


const _authReducer = createReducer(
  initialAuthState,
  on(AuthAction.LoginSuccess, (state, action) => ({
    ...state,
    me: action
  })),
  on(AuthAction.Logout, (state, action) => ({
    ...initialAuthState
  })),
  on(AuthAction.Check, (state, action) => ({
    ...state,
    me: action
  }))
);

export function authReducer(state: IAuthState | undefined, action: any) {
  return _authReducer(state, action);
}
