import { Role } from '@shikicinema';
import * as bcrypt from 'bcrypt';
import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column('smallint', { array: true })
  roles!: Role[];

  @Column({ name: 'shikimori_id', default: null })
  shikimoriId: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  constructor(
    login: string,
    password: string,
    email: string,
    roles: Role[] = [Role.user],
    shikimoriId: string | null = null,
    name: string = login,
    createdAt: Date = new Date(),
    updateAt: Date = new Date()
  ) {
    this.login = login;
    this.password = password;
    this.email = email;
    this.roles = roles;
    this.shikimoriId = shikimoriId;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updateAt;
  }
}
