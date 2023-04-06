import {
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from 'typeorm';
import { Role } from '@shikicinema/types';
import { UserEntity } from '~backend/entities/user';

@Entity('user_roles')
export class UserRolesEntity {
    @PrimaryColumn({ name: 'user_id' })
    userId: number;

    @PrimaryColumn()
    role: Role;

    @ManyToOne(() => UserEntity, ({ roles }) => roles)
    @JoinColumn({ name: 'user_id', foreignKeyConstraintName: 'user_id' })
    user!: UserEntity;

    constructor(user: UserEntity, role: Role) {
        this.userId = user.id;
        this.user = user;
        this.role = role;
    }
}
