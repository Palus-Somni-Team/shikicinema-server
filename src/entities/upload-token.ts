import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UploaderEntity } from './uploader';

@Entity('upload_tokens')
export class UploadTokenEntity {
    @PrimaryColumn('uuid', { name: 'token' })
    token: string;

    @ManyToOne(() => UploaderEntity, (uploader) => uploader.uploadTokens, { cascade: true })
    @JoinColumn({ name: 'uploader_id' })
    uploader: UploaderEntity;

    @Column({ name: 'expired_at' })
    expiredAt: Date;

    @Column('boolean', { name: 'revoked' })
    revoked: boolean;

    get isExpired(): boolean {
        return this.expiredAt < new Date();
    }

    constructor(
        token: string,
        uploader: UploaderEntity,
        // TODO: add configs
        expiredAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        revoked = false,
    ) {
        this.token = token;
        this.uploader = uploader;
        this.expiredAt = expiredAt;
        this.revoked = revoked;
    }
}
