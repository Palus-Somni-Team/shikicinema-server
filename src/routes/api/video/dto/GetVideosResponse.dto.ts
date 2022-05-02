import { Expose } from 'class-transformer';
import { GetVideosResponse as Response } from '@lib-shikicinema';

import { VideoResponse } from '@app-routes/api/video/dto/VideoResponse.dto';

export class GetVideosResponse implements Response {
    @Expose()
    data: VideoResponse[];


    constructor(data: VideoResponse[]) {
        this.data = data;
    }
}
