/**
 * Represents request for a video request approve.
 *
 * @property {number} id Id of the video request to approve.
 * @property {string} comment Some comment.
 */
export interface ApproveVideoRequestRequest {
    id: number;
    comment?: string;
}
