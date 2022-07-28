import { VideoKindEnum } from './VideoKindEnum';
import { VideoQualityEnum } from './VideoQualityEnum';

/**
 * Interface for the classes representing video creation request.
 *
 * @property {string} url see {@link Video.url}.
 * @property {number} animeId see {@link Video.animeId}.
 * @property {number} episode see {@link Video.episode}.
 * @property {VideoKindEnum} kind see {@link Video.kind}.
 * @property {string} language see {@link Video.language}.
 * @property {VideoQualityEnum} quality see {@link Video.quality}.
 * @property {string} author see {@link Video.author}.
 */
export interface CreateVideoRequest {
    url: string;
    animeId: number;
    episode: number;
    kind: VideoKindEnum;
    language: string;
    quality: VideoQualityEnum;
    author: string;
}
