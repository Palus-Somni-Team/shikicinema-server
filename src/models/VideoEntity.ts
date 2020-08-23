import {AutoIncrement, Column, DataType, ForeignKey, HasOne, Model, PrimaryKey, Table} from 'sequelize-typescript';
import {User} from './User';
import {VideoKind, VideoQuality} from '../../lib/shikicinema';
import {EpisodeEntity} from './EpisodeEntity';

@Table({tableName: 'videos'})
export class VideoEntity extends Model<VideoEntity> {
    /**
     * Id of a video.
     */
    @PrimaryKey
    @AutoIncrement
    @Column
    id!: number;

    /**
     * Url that provides the video and can be used in an iframe component.
     */
    @Column(DataType.STRING(512))
    url!: string;

    /**
     * Number of an episode.
     */
    @ForeignKey(() => EpisodeEntity)
    @Column
    episodeId!: number;

    /**
     * Kind of the video.
     */
    @Column(DataType.SMALLINT)
    kind!: VideoKind;

    /**
     * Language of a subtitles or dubbing.
     */
    @Column(DataType.STRING(16))
    language!: string;

    /**
     * Quality of the video.
     */
    @Column(DataType.SMALLINT)
    quality!: VideoQuality;

    /**
     * People responsible for the release. Eladiel, Oriko, Ghost etc.
     */
    @Column(DataType.STRING(512))
    author!: string

    @Column({field: 'created_at'})
    createdAt!: Date;

    @Column({field: 'updated_at'})
    updatedAt!: Date;

    /**
     * User that upload video.
     */
    @ForeignKey(() => User)
    @Column
    uploader!: number;

    @Column
    watchesCount = 0;

    @HasOne(() => EpisodeEntity)
    episode?: EpisodeEntity;
}
