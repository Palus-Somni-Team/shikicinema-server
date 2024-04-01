/**
 * Interface for the classes video request rejection request.
 *
 * @property {number} id Id of the video request to reject.
 * @property {string} comment Rejection reason.
 */
export interface RejectVideoRequestRequest {
    id: number;
    comment?: string;
}
