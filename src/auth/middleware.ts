import * as bcrypt from 'bcrypt';
import {NextFunction, Request, Response} from 'express';
import {ServerErrors} from '../types/ServerErrors';
import {UserEntity} from '../models/UserEntity';

export function destroyInvalidCookies(req: Request, res: Response, next: NextFunction): void {
    if (req.session?.cookies && !req.session?.user) {
        res.clearCookie('user_sid');
    }
    next();
}

/**
 * This middleware ensures that request is authorized by bearer token or session cookies.
 * Also it checks scopes for request and secured endpoint. Returns '401 Unauthorized' if any check fails
 *
 * @param {string[]} scopes Scopes that allowed for accessing this resources. NOTE that 'default' scope means any scope
 * @returns {Function} ExpressJS middleware function
 */
export function allowFor(...scopes: string[]): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction): void => {
        // request with session cookies
        if (req.session?.user) {
            return next();
        }

        // TODO: implement shikicinema token authorization

        return next(ServerErrors.UNAUTHORIZED);
    };
}

export async function validateUser(user: UserEntity, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password)
        .then((ok) => ok)
        .catch((err) => {
            console.error(err);
            return false;
        });
}
