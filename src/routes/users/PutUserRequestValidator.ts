import {body, param} from 'express-validator';
import {Validator} from '../../services/validators/Validator';
import {BodyRequest} from '../../types/Requests';
import {UpdateUserRequest} from '../../../lib/shikicinema';
import {ALL_ROLES} from '../../models/UserEntity';
import {User} from '../../types/User';

class PutUserRequestValidator extends Validator {
    protected async validateCore(req: BodyRequest<UpdateUserRequest>): Promise<void> {
        await param('id')
            .isInt({min: 0})
            .withMessage('Must be a number greater or equal to 0')
            .run(req);

        await body(['name', 'login'])
            .optional()
            .isString()
            .isLength({min: 3, max: 16})
            .withMessage('Must be a string with length between 3 and 16 symbols')
            .run(req);

        await body('email')
            .optional()
            .matches(/@gmail.com/i)
            .withMessage('Only Gmail email service allowed')
            .run(req);

        await body('shikimoriId')
            .optional()
            .isInt({min: 0})
            .withMessage('Must be a number greater or equal to 0')
            .run(req);

        await body('roles')
            .optional()
            .custom((roles) => User.isValidRoles(roles))
            .withMessage(`Must be an array with at least one of ${JSON.stringify(ALL_ROLES)}`)
            .run(req);
    }
}

export default new PutUserRequestValidator();

