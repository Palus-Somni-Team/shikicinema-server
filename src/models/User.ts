import {
    BelongsToMany,
    Column,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';
import {Scope} from './Scope';
import {UserScopes} from './UserScopes';

@Table({
    tableName: 'users',
})
export class User extends Model<User> {
    @PrimaryKey
    @Column
    id!: number;

    @Column
    name!: string;

    @Column
    login!: string;

    @Column
    password!: string;

    @Column
    email!: string;

    @BelongsToMany(() => Scope, () => UserScopes, 'user_id')
    scopes!: Scope[];

    @Column({field: 'shikimori_id'})
    shikimoriId?: string;

    @Column( {field: 'created_at'})
    createdAt?: Date;

    @Column( {field: 'updated_at'})
    updatedAt?: Date;

    get isAdmin(): boolean {
        return this?.scopes?.some((s) => s.value === 'admin') || false;
    }
}
