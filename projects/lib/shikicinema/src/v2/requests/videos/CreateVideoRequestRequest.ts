import { VideoRequestTypeEnum } from './VideoRequestTypeEnum';
import { VideoKindEnum, VideoQualityEnum } from '../../..';

/**
 * Interface for the classes representing create video request.
 *
 * @property {number} videoId Id of the video that the request belongs to.
 * @property {VideoRequestTypeEnum} type Type of the request.
 * @property {number} episode Optional. Episode number to be set.
 * @property {VideoKindEnum} kind Optional. Kind to be set.
 * @property {VideoQualityEnum} quality Optional. Quality to be set.
 * @property {string} language Optional. Language to be set.
 * @property {string} author Optional. Author to be set.
 * @property {string} comment Not optional if type is INFO, otherwise is optional. Some human-readable text.
 */
export interface CreateVideoRequestRequest {
    videoId: number;
    type: VideoRequestTypeEnum;
    episode?: number;
    kind?: VideoKindEnum;
    quality?: VideoQualityEnum;
    language?: string;
    author?: string;
    comment?: string;
}
