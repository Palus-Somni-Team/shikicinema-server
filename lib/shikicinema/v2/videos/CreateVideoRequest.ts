import './Video';
import {VideoKind} from './VideoKind';
import {VideoQuality} from './VideoQuality';

/**
 * Interface for the classes representing video creation request.
 *
 * @property {string} url see {@link Video.url}.
 * @property {number} animeId see {@link Video.animeId}.
 * @property {number} episode see {@link Video.episode}.
 * @property {VideoKind} kind see {@link Video.kind}.
 * @property {string} language see {@link Video.language}.
 * @property {VideoQuality} quality see {@link Video.quality}.
 * @property {string} studio see {@link Video.studio}.
 * @property {string[]} releasedBy see {@link Video.releasedBy}.
 */
export interface CreateVideoRequest {
    url: string;
    animeId: number;
    episode: number;
    kind: VideoKind;
    language: string;
    quality: VideoQuality;
    studio: string;
    releasedBy: string[];
}
