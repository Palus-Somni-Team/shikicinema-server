import { AuthorEntity, UploaderEntity } from '~backend/entities';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { VideoKindEnum, VideoQualityEnum } from '@shikicinema/types';


@Entity('videos')
export class VideoEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'anime_id' })
    animeId: number;

    @Column({ name: 'episode' })
    episode: number;

    @Column()
    url: string;

    @Column('smallint')
    kind: VideoKindEnum;

    @Column()
    language: string;

    @Column('smallint')
    quality: VideoQualityEnum;

    @ManyToOne(() => AuthorEntity, (author) => author.videos, { cascade: ['insert', 'update'] })
    @JoinColumn({ name: 'author_id' })
    author: AuthorEntity;

    @Column({ name: 'watches_count' })
    watchesCount: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;

    @ManyToOne(() => UploaderEntity, (uploader) => uploader.videos, { cascade: ['insert', 'update'] })
    @JoinColumn({ name: 'uploader_id' })
    uploader: UploaderEntity;

    constructor(
        animeId: number,
        episode: number,
        url: string,
        kind: VideoKindEnum,
        language: string,
        quality: VideoQualityEnum,
        author: AuthorEntity,
        uploader: UploaderEntity,
        watchesCount = 0,
    ) {
        this.animeId = animeId;
        this.episode = episode;
        this.url = url;
        this.kind = kind;
        this.language = language;
        this.quality = quality;
        this.author = author;
        this.uploader = uploader;
        this.watchesCount = watchesCount;
    }
}
