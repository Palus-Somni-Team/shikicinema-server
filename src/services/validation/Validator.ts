import {Request, Response, NextFunction, RequestHandler} from 'express';
import {validationResult} from 'express-validator';
import {ValidationError} from '../../types/ValidationError';

export abstract class Validator {
    public static handle(validator: Validator): RequestHandler {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> =>
            await validator.validate(req, res, next);
    }

    protected async validate(req: Request, res: Response, next: NextFunction): Promise<void> {
        await this.validateCore(req);
        Validator.processValidationResult(req, next);
    }

    protected abstract async validateCore(req: Request): Promise<void>;

    private static processValidationResult(req: Request, next: NextFunction): void {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new ValidationError(422, errors.array()));
        } else {
            next();
        }
    }
}
