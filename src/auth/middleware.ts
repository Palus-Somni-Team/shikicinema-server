import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { ServerErrors } from '../types/ServerErrors';

export function destroyInvalidCookies(req: Request, res: Response, next: Function) {
    if (req.session?.cookies && !req.session?.user) {
        res.clearCookie('user_sid');
    }
    next();
}

/**
 * This middleware ensures that request is authorized by bearer token or session cookies.
 * Also it checks scopes for request and secured endpoint. Returns '401 Unauthorized' if any check fails
 *
 * @param scopes scopes that allowed for accessing this resources. NOTE that 'default' scope means any scope
 */
export function allowFor(...scopes: string[]) {
    return function(req: Request, res: Response, next: Function) {

        // request with session cookies
        if (req.session?.user) {
            return next();
        }

        // TODO: implement shikicinema token authorization

        return next(ServerErrors.UNAUTHORIZED);
    };
}

// TODO: change user's ANY type to actually user's type
export async function validateUser(user: any, password: string) {
    return await bcrypt.compare(password, user.password)
        .then((ok) => ok)
        .catch((err) => {
            console.error(err);
            return false;
        });
}
