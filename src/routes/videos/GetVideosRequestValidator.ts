import {Request} from 'express';
import {query} from 'express-validator';
import {Validator} from '../../services/validation/Validator';

class GetVideosRequestValidator extends Validator {
    protected async validateCore(req: Request): Promise<void> {
        await query('animeId')
            .isInt({min: 0})
            .run(req);

        await query('episode')
            .isInt({min: 1})
            .run(req);
    }
}

export default new GetVideosRequestValidator();
