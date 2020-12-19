import { Role } from '@shikicinema';

export class User {
  id: number;
  login: string;
  email: string;
  name: string;
  roles: Role[];
  shikimoriId: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    login: string,
    email: string,
    name: string,
    roles: string[],
    shikimoriId: string | null,
    createdAt: string,
    updatedAt: string,
  ) {
    this.id = id;
    this.login = login;
    this.email = email;
    this.name = name;
    this.roles = roles.map((role) => Role[role]);
    this.shikimoriId = shikimoriId;
    this.createdAt = createdAt ? new Date(Date.parse(createdAt)) : null;
    this.updatedAt = updatedAt ? new Date(Date.parse(updatedAt)) : null;
  }
}
