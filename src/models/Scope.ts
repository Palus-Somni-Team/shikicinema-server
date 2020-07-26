import {Column, ForeignKey, Model, Table} from 'sequelize-typescript';
import {User} from "./User";

@Table({
    updatedAt: false
})
export class Scope extends Model<Scope> {

    @ForeignKey(() => User)
    userId!: number;

    @Column
    value!: string;
}
