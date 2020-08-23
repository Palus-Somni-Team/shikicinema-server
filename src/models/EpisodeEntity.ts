import {Column, DataType, ForeignKey, Model, PrimaryKey, Table, AutoIncrement, HasMany} from 'sequelize-typescript';
import {VideoEntity} from './VideoEntity';

@Table({tableName: 'episodes', timestamps: false})
export class EpisodeEntity extends Model<EpisodeEntity> {
    /**
     * Id of an anime from shikimori.one.
     */
    @PrimaryKey
    @Column
    id!: number;

    /**
     * Id of an anime from shikimori.one.
     */
    @Column({field: 'anime_id'})
    animeId!: number;

    /**
     * Number of an episode.
     */
    @Column
    number!: number;

    @HasMany(() => VideoEntity)
    videos!: VideoEntity[];
}
