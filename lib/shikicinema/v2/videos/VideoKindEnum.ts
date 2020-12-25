/**
 * Represents types of video kind.
 *
 * @enum {VideoKindEnum}.
 * @property {SUBTITLES} SUBTITLES Video that has subtitles.
 * @property {DUBBING} DUBBING Videos with non-original dubbing.
 * @property {ORIGINAL} ORIGINAL Original video.
 */
export enum VideoKindEnum {
    SUBTITLES = 0,
    DUBBING = 1,
    ORIGINAL = 2,
}
