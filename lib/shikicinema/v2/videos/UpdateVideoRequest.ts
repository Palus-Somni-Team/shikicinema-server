import './Video';
import './VideoKind';
import './VideoQuality';
import {VideoKind} from './VideoKind';
import {VideoQuality} from './VideoQuality';

/**
 * Interface for the classes representing the video update request.
 *
 * @property {number} id Id of a video that will be updated.
 * @property {string} url see {@link Video.url}.
 * @property {number} animeId see {@link Video.animeId}.
 * @property {number} episode see {@link Video.episode}.
 * @property {VideoKind} kind see {@link Video.kind}.
 * @property {string} language see {@link Video.language}.
 * @property {VideoQuality} quality see {@link Video.quality}.
 * @property {string} studio see {@link Video.studio}.
 * @property {number} watchesCount see {@link Video.watchesCount}.
 * @property {string[]} releasedBy see {@link Video.releasedBy}.
 */
export interface UpdateVideoRequest {
    id: number;
    url?: string;
    animeId?: number;
    episode?: number;
    kind?: VideoKind;
    language?: string;
    quality?: VideoQuality;
    studio?: string;
    releasedBy?: string[];
    watchesCount?: number;
    uploader?: number;
}
