import { VideoRequestStatusEnum } from './VideoRequestStatusEnum';
import { VideoRequestTypeEnum } from './VideoRequestTypeEnum'
import { Author, Uploader, User, Video, VideoKindEnum, VideoQualityEnum } from '../../..';

/**
 * Interface for the classes representing video request.
 *
 * @property {number} id Id of the request.
 * @property {VideoRequestTypeEnum} type Type of the request.
 * @property {number} episode Number of the anime episode to set.
 * @property {VideoKindEnum} kind Kind to set.
 * @property {VideoQualityEnum} quality Quality to set.
 * @property {string} language Language to set.
 * @property {string} comment Comment that describes a problem.
 * @property {string} reviewerComment Reviewer comment.
 * @property {Date} createdAt When request was created.
 * @property {Date} updatedAt When request was updated last time.
 * @property {Video} video Video that request belongs to.
 * @property {Author} author Author to set.
 * @property {Uploader} createdBy Request creator.
 * @property {User} user Request reviewer.
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
    createdBy: Uploader;
    reviewedBy: User;
}
