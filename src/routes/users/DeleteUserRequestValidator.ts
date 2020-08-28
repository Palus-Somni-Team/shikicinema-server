import {Request} from 'express';
import {param} from 'express-validator';
import {Validator} from '../../services/validators/Validator';

class DeleteUserRequestValidator extends Validator {
    protected async validateCore(req: Request): Promise<void> {
        await param('id')
            .isInt({min: 0})
            .withMessage('Must be a number greater or equal to 0')
            .run(req);
    }
}

export default new DeleteUserRequestValidator();

