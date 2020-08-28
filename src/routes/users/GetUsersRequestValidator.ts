import {query} from 'express-validator';
import {Validator} from '../../services/validators/Validator';
import {QueryRequest} from '../../types/Requests';
import {GetUsersRequest} from '../../../lib/shikicinema';
import {ALL_ROLES} from '../../models/UserEntity';
import {User} from '../../types/User';

class GetUsersRequestValidator extends Validator {
    protected async validateCore(req: QueryRequest<GetUsersRequest>): Promise<void> {
        await query('limit')
            .optional()
            .isInt({min: 1})
            .withMessage('Must be a number greater or equal to 1')
            .run(req);

        await query('offset')
            .optional()
            .isInt({min: 0})
            .withMessage('Must be a number greater or equal to 0')
            .run(req);

        await query(['name', 'login'])
            .optional()
            .isString()
            .isLength({min: 3, max: 16})
            .withMessage('Must be a string with length between 3 and 16 symbols')
            .run(req);

        await query('email')
            .optional()
            .matches(/@gmail.com/i)
            .withMessage('Only Gmail email service allowed')
            .run(req);

        await query('shikimoriId')
            .optional()
            .isInt({min: 0})
            .withMessage('Must be a number greater or equal to 0')
            .run(req);

        await query('roles')
            .optional()
            .custom((roles) => User.isValidRoles(roles))
            .withMessage(`Must be an array with at least one of ${JSON.stringify(ALL_ROLES)}`)
            .run(req);

        await query('createdAt')
            .optional()
            .isISO8601()
            .withMessage('Must be a string in ISO 8601 format')
            .run(req);
    }
}

export default new GetUsersRequestValidator();

