import {Column, DataType, Model, PrimaryKey, Table} from 'sequelize-typescript';

export const ALL_ROLES = ['admin', 'banned', 'default', 'user'] as const;
export type Role = typeof ALL_ROLES[number];

@Table({
    tableName: 'users',
})
export class UserEntity extends Model<UserEntity> {
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

    @Column(DataType.ARRAY(DataType.ENUM(...ALL_ROLES)))
    roles!: Role[];

    @Column({field: 'shikimori_id'})
    shikimoriId?: string;

    @Column( {field: 'created_at'})
    createdAt?: Date;

    @Column( {field: 'updated_at'})
    updatedAt?: Date;

    get isAdmin(): boolean {
        return this?.roles?.some((role) => role === 'admin') || false;
    }
}
