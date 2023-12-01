import { AuthorEntity, UploaderEntity, UserEntity, VideoEntity } from '~backend/entities';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { VideoKindEnum, VideoQualityEnum, VideoRequestStatusEnum, VideoRequestTypeEnum } from '@shikicinema/types';

@Entity('video_requests')
export class VideoRequestEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('smallint')
    type: VideoRequestTypeEnum;

    @Column('smallint')
    status: VideoRequestStatusEnum;

    @Column({ nullable: true })
    episode: number;

    @Column('smallint', { nullable: true })
    kind: VideoKindEnum;

    @Column('smallint', { nullable: true })
    quality: VideoQualityEnum;

    @Column({ nullable: true })
    language: string;

    @Column({ nullable: true })
    comment: string;

    @Column({ name: 'reviewer_comment', nullable: true })
    reviewerComment?: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    //#region relations

    @ManyToOne(() => VideoEntity, { cascade: ['update'], onDelete: 'CASCADE' })
    @JoinColumn({ name: 'video_id' })
    video: VideoEntity;

    @ManyToOne(() => AuthorEntity, { cascade: ['insert'], nullable: true })
    @JoinColumn({ name: 'author_id' })
    author: AuthorEntity;

    @ManyToOne(() => UploaderEntity)
    @JoinColumn({ name: 'created_by_id' })
    createdBy: UploaderEntity;

    @ManyToOne(() => UserEntity, { nullable: true })
    @JoinColumn({ name: 'reviewed_by_id' })
    reviewedBy: UserEntity;

    //#endregion relation

    constructor(
        type: VideoRequestTypeEnum,
        status: VideoRequestStatusEnum,
        episode: number,
        kind: VideoKindEnum,
        quality: VideoQualityEnum,
        language: string,
        comment: string,
        reviewerComment: string,
        video: VideoEntity,
        author: AuthorEntity,
        createdBy: UploaderEntity,
        reviewedBy: UserEntity,
    ) {
        this.type = type;
        this.status = status;
        this.episode = episode;
        this.kind = kind;
        this.quality = quality;
        this.language = language;
        this.comment = comment;
        this.reviewerComment = reviewerComment;
        this.video = video;
        this.author = author;
        this.createdBy = createdBy;
        this.reviewedBy = reviewedBy;
    }
}
