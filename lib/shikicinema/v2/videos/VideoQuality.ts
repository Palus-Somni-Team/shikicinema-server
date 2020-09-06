/**
 * Represents types of video quality.
 *
 * @enum {VideoQuality}.
 * @property {UNKNOWN} UNKNOWN Quality is unknown.
 * @property {TV} TV TV-Rip.
 * @property {WEB} WEB WEB-DL.
 * @property {DVD} DVD DVD-Rip.
 * @property {BD} BD DB-Rip.
 */
export enum VideoQuality {
    UNKNOWN = 0,
    TV = 1,
    WEB = 2,
    DVD = 3,
    BD = 4,
}
