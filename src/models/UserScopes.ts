import {Column, ForeignKey, Model, Table} from 'sequelize-typescript';
import {User} from './User';
import {Scope} from './Scope';

@Table({
    createdAt: false,
    updatedAt: false
})
export class UserScopes extends Model<UserScopes> {

    @ForeignKey(() => User)
    @Column
    userId!: number;

    @ForeignKey(() => Scope)
    @Column
    scopeId!: number
}
