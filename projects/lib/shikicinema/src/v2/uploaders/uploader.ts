export interface Uploader {
    /**
     * Uploader's Id.
     */
    id: number;

    /**
     * User that's bound to the uploader
     */
    userId: number | null;

    /**
     * Uploader's ID on shikimori
     */
    shikimoriId: string;

    /**
     * Status of ban
     */
    banned: boolean;
}
