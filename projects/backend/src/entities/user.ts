import * as bcrypt from 'bcrypt';
import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { UploaderEntity } from '~backend/entities';
import { UserRolesEntity } from '~backend/entities/user-roles';

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

    @OneToMany(() => UserRolesEntity, ({ user }) => user)
    roles: UserRolesEntity[];

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
        uploader: UploaderEntity = null,
        name: string = login,
        createdAt: Date = new Date(),
        updateAt: Date = new Date(),
    ) {
        this.login = login;
        this.password = password;
        this.email = email;
        this.uploader = uploader;
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = updateAt;
    }
}
