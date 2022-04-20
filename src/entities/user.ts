import * as bcrypt from 'bcrypt';
import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Role } from '@lib-shikicinema';

import { UploaderEntity } from '@app-entities';
import { getIntArrayType } from '@app-utils/typeorm-helper';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    login: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column({ array: true, type: getIntArrayType() })
    roles!: Role[];

    @OneToOne(() => UploaderEntity, (uploader) => uploader)
    @JoinColumn({ name: 'uploader_id' })
    uploader: UploaderEntity;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    constructor(
        login: string,
        password: string,
        email: string,
        roles: Role[] = [Role.user],
        uploader: UploaderEntity = null,
        name: string = login,
        createdAt: Date = new Date(),
        updateAt: Date = new Date()
    ) {
        this.login = login;
        this.password = password;
        this.email = email;
        this.roles = roles;
        this.uploader = uploader;
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = updateAt;
    }
}
