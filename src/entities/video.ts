import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { UploaderEntity } from '@app-entities';
import { VideoKindEnum, VideoQualityEnum } from '@lib-shikicinema';


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

    @Column({ enum: VideoKindEnum })
    kind: VideoKindEnum;

    @Column()
    language: string;

    @Column({ enum: VideoQualityEnum })
    quality: VideoQualityEnum;

    @Column()
    author: string;

    @Column({ name: 'watches_count' })
    watchesCount: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => UploaderEntity, (uploader) => uploader.videos, { cascade: true })
    @JoinColumn({ name: 'uploader_id' })
    uploader: UploaderEntity;

    constructor(
        animeId: number,
        episode: number,
        url: string,
        kind: VideoKindEnum,
        language: string,
        quality: VideoQualityEnum,
        author: string,
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
