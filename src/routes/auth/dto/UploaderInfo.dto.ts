import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UploaderInfo {
    @Expose()
    id: number;

    @Expose()
    banned: boolean;

    @Expose()
    shikimoriId: string;
}
