import { createAction, props } from '@ngrx/store';
import { AdminUser } from '@shikicinema/types';

export namespace AuthAction {
  export const Login = createAction(
    '[Auth] Login',
    props<{login: string, password: string}>()
  )

  export const LoginSuccess = createAction(
    '[Auth] Login Success',
    props<AdminUser>()
  )

  export const Logout = createAction(
    '[Auth] Logout'
  )

  export const Check = createAction(
    '[Auth] Check',
    props<AdminUser>()
  )
}
