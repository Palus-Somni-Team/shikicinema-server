import {BelongsToMany, Column, Model, PrimaryKey, Table} from 'sequelize-typescript';
import {Scope} from './Scope';
import {UserScopes} from './UserScopes';

@Table({
    updatedAt: false
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

    @BelongsToMany(() => Scope, () => UserScopes, 'userId')
    scopes!: Scope[];

    @Column
    shikimoriId?: string;

    get isAdmin() {
        return this?.scopes?.some((s) => s.value === 'admin');
    }
}
