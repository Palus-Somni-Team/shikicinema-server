import { Uploader } from './Uploader';
import { VideoKindEnum, VideoQualityEnum } from '@lib-shikicinema';

/**
 * Represents video.
 */
export interface Video {
    /**
     * Resource ID
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
    kind: VideoKindEnum;

    /**
     * Language of a subtitles or dubbing in ISO31661 Alpha2 format.
     */
    language: string;

    /**
     * Quality of the video.
     */
    quality: VideoQualityEnum;

    /**
     * Studio that prepared a release. AniLibria, OnibakuGroup, etc.
     * You also can add people responsible for the release. Like Eladiel, Oriko, Ghost etc.
     */
    author: string;

    /**
     * Number of people who marked the video as viewed.
     */
    watchesCount: number;

    /**
     * Shikimori user who uploaded the video.
     */
    uploader: Uploader;
}
