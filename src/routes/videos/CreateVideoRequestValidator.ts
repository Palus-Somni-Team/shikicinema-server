import {Request} from 'express';
import {body} from 'express-validator';
import {VideoKind, VideoQuality} from '../../../lib/shikicinema';
import {Validator} from '../../services/validation/Validator';

class CreateVideoRequestValidator extends Validator {
    protected async validateCore(req: Request): Promise<void> {
        await body('url')
            .isLength({min: 3, max: 512})
            .withMessage('Length must be between 3 and 16 symbols.')
            .custom((value) => {new URL(value);})
            .run(req);

        await body('author')
            .isLength({min: 3, max: 512})
            .withMessage('Length must be between 3 and 16 symbols.')
            .run(req);

        await body('animeId')
            .isInt({min: 0})
            .withMessage('Value must be greater or equal to 0.')
            .run(req);

        await body('episode')
            .isInt({min: 1})
            .withMessage('Value must be greater or equal to 1.')
            .run(req);

        await body('kind')
            .isIn(Object.values(VideoKind))
            .withMessage('Expected value to be one of (' + Object.values(VideoKind).join(', ') + ').')
            .run(req);

        await body('language')
            .isLength({min: 3, max: 16})
            .withMessage('Length must be between 3 and 16 symbols.')
            .run(req);

        await body('quality')
            .isIn(Object.values(VideoQuality))
            .withMessage('Expected value to be one of (' + Object.values(VideoQuality).join(', ') + ').')
            .run(req);
    }
}

export default new CreateVideoRequestValidator();
