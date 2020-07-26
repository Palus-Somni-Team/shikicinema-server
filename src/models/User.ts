import {Column, HasMany, Model, Table} from 'sequelize-typescript';
import {Scope} from './Scope';

@Table({
    updatedAt: false
})
export class User extends Model<User> {

    @Column
    name!: string;

    @Column
    login!: string;

    @Column
    password!: string;

    @Column
    email!: string;

    @HasMany(() => Scope)
    scopes!: Scope[];

    @Column
    shikimoriId?: string;

    get isAdmin() {
        return this?.scopes?.some((s) => s.value === 'admin');
    }
}
