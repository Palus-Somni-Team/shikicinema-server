import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user';
import { UploadTokenEntity } from './upload-token';

@Entity('uploaders')
export class UploaderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  banned: boolean

  @OneToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => UploadTokenEntity, (uploadToken) => uploadToken.uploader)
  uploadTokens: UploadTokenEntity[];

  @Column({ name: 'shikimori_id' })
  shikimoriId: string;

  constructor(
      shikimoriId: string,
      user: UserEntity,
      uploadTokens: UploadTokenEntity[],
      banned = false,
  ) {
      this.shikimoriId = shikimoriId;
      this.user = user;
      this.uploadTokens = uploadTokens;
      this.banned = banned;
  }
}
