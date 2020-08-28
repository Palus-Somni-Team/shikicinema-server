import {Request} from 'express';
import {body} from 'express-validator';
import {Validator} from '../../services/validators/Validator';

class CreateUsersRequestValidator extends Validator {
    protected async validateCore(req: Request): Promise<void> {
        await body('login')
            .isString()
            .isLength({min: 3, max: 16})
            .withMessage('Must be a string with length between 3 and 16 symbols')
            .run(req);

        await body('password')
            .isString()
            .isLength({min: 6, max: 32})
            .withMessage('Must be a string with length between 6 and 32 symbols')
            .run(req);

        await body('email')
            .matches(/@gmail.com/i)
            .withMessage('Only Gmail email service allowed')
            .run(req);
    }
}

export default new CreateUsersRequestValidator();

