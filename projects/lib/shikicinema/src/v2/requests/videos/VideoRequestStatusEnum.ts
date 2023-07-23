/**
 * Represents types of video request types.
 *
 * @enum {VideoRequestStatusEnum}.
 * @property {ACTIVE} ACTIVE Request is waiting for review.
 * @property {APPROVED} APPROVED Request was approved. Final state.
 * @property {CANCELED} CANCELED Request was canceled by owner. Final state.
 * @property {REJECTED} REJECTED Request was rejected. Final state.
 */
export enum VideoRequestStatusEnum {
    ACTIVE = 0,
    APPROVED = 1,
    CANCELED = 2,
    REJECTED = 3,
}
