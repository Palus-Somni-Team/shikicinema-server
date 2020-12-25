import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UploadTokenInfo {
  @Expose()
  token: string;

  @Expose()
  expiredAt: Date;
}
