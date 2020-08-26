import {VideoKind} from './VideoKind';
import {VideoQuality} from './VideoQuality';

/**
 * Represents video.
 */
export interface Video {
    /**
     * Id of a video.
     */
    id: number;

    /**
     * Url that provides the video and can be used in an iframe component.
     *
     * @example https://video.sibnet.ru/shell.php?videoid=3388202&share=1.
     */
    url: string;

    /**
     * Id of an anime from shikimori.one.
     *
     * @example One Piece has an anime id of 21.
     */
    animeId: number;

    /**
     * Number of an episode.
     */
    episode: number;

    /**
     * Kind of the video.
     */
    kind: VideoKind;

    /**
     * Language of a subtitles or dubbing.
     */
    language: string;

    /**
     * Quality of the video.
     */
    quality: VideoQuality;

    /**
     * Studio that prepared a release. AniLibria, OnibakuGroup, etc.
     */
    studio: string;

    /**
     * People responsible for the release. Eladiel, Oriko, Ghost etc.
     *
     * Note: These are not only dubbers.
     */
    releasedBy: string[];

    /**
     * Number of people who marked the video as viewed.
     */
    watchesCount: number;

    /**
     * User who uploaded the video.
     */
    uploader: number;
}
