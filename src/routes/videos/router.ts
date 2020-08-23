import {Router} from 'express';
import {Validator} from '../../services/validation/Validator';
import CreateVideoRequestValidator from './CreateVideoRequestValidator';
import {CreateVideoRequest} from '../../../lib/shikicinema';
import VideoRepo from '../../services/VideoRepo';
import {ServerErrors} from '../../types/ServerErrors';

export const videos = Router();

videos.post('/', Validator.handle(CreateVideoRequestValidator), async (req, res, next) => {
    const body = req.body as CreateVideoRequest;
    try {
        const video = VideoRepo.create(body, req.session?.user.id);
    } catch (e) {
        console.log(e);
        next(ServerErrors.UNAUTHORIZED); // todo: change error;
    }
});
