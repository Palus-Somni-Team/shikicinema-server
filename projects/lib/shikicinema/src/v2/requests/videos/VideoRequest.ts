import { VideoRequestStatusEnum } from './VideoRequestStatusEnum';
import { VideoRequestTypeEnum } from './VideoRequestTypeEnum'
import { Author, User, Video, VideoKindEnum, VideoQualityEnum } from '../../..';

/**
 * Interface for the classes representing video request.
 *
 * @property {number} id Id of the request.
 * @property {VideoRequestTypeEnum} type Type of the request.
 * @property {number} episode Number of the anime episode to set.
 * @property {VideoKindEnum} kind Kind to set.
 * @property {VideoQualityEnum} quality Quality to set.
 * @property {string} language Language to set.
 * @property {string} comment Comment that describes reason or problem.
 * @property {string} rejectReason Describes why request was rejected.
 * @property {Date} createdAt When request was created.
 * @property {Date} updatedAt When request was updated last time.
 * @property {Video} video Video that request belongs to.
 * @property {Author} author Author to set.
 * @property {User} user Request creator.
 */
export interface VideoRequest {
    id: number;
    type: VideoRequestTypeEnum;
    status: VideoRequestStatusEnum;
    episode: number;
    kind: VideoKindEnum;
    quality: VideoQualityEnum;
    language: string;
    comment: string;
    reviewerComment: string;
    createdAt: Date;
    updatedAt: Date;
    video: Video;
    author: Author;
    createdBy: User;
    reviewedBy: User;
}
