import {Column, ForeignKey, Model, Table} from 'sequelize-typescript';
import {User} from './User';
import {Scope} from './Scope';

@Table({
    tableName: 'user_scopes',
    timestamps: false,
})
export class UserScopes extends Model<UserScopes> {

    @ForeignKey(() => User)
    @Column({field: 'user_id'})
    userId!: number;

    @ForeignKey(() => Scope)
    @Column({field: 'scope_id'})
    scopeId!: number
}
