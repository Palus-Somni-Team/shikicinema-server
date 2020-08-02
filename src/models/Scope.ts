import {BelongsToMany, Column, Model, Table} from 'sequelize-typescript';
import {UserScopes} from './UserScopes';
import {User} from './User';

@Table({
    tableName: 'scopes',
    timestamps: false,
})

export class Scope extends Model<Scope> {
    @Column
    value!: string;

    @BelongsToMany(() => User, () => UserScopes, 'scope_id')
    scopes!: Scope[];
}
