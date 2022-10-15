import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { VideoEntity } from '@app-entities';

@Entity('authors')
export class AuthorEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => VideoEntity, (video) => video.author)
    videos: VideoEntity[];

    constructor(name: string) {
        this.name = name?.trim();
    }
}
