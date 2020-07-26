import {BelongsToMany, Column, Model, Table} from 'sequelize-typescript';
import {UserScopes} from "./UserScopes";
import {User} from "./User";

@Table({
    createdAt: false,
    updatedAt: false
})
export class Scope extends Model<Scope> {

    @Column
    value!: string;

    @BelongsToMany(() => User, () => UserScopes, 'scopeId')
    scopes!: Scope[];

}
