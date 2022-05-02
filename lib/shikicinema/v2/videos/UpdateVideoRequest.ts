import { VideoKindEnum } from './VideoKindEnum';
import { VideoQualityEnum } from './VideoQualityEnum';

/**
 * Interface for the classes representing the video update request.
 *
 * @property {string} url see {@link Video.url}.
 * @property {number} animeId see {@link Video.animeId}.
 * @property {number} episode see {@link Video.episode}.
 * @property {VideoKindEnum} kind see {@link Video.kind}.
 * @property {string} language see {@link Video.language}.
 * @property {VideoQualityEnum} quality see {@link Video.quality}.
 * @property {string} author see {@link Video.author}.
 * @property {number} watchesCount see {@link Video.watchesCount}.
 */
export interface UpdateVideoRequest {
    url?: string;
    animeId?: number;
    episode?: number;
    kind?: VideoKindEnum;
    language?: string;
    quality?: VideoQualityEnum;
    author?: string | null;
    watchesCount?: number;
}
