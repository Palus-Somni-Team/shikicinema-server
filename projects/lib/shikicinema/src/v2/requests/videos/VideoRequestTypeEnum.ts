/**
 * Represents types of video request types.
 *
 * @enum {VideoRequestTypeEnum}.
 * @property {INFO} INFO Request created to inform admin about something.
 * @property {UPDATE} UPDATE Request created to update information about video.
 * @property {DELETE} DELETE Request created to delete video.
 */
export enum VideoRequestTypeEnum {
    INFO = 0,
    UPDATE = 1,
    DELETE = 2,
}
