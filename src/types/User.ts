import {Role, User as UserDTO} from '../../lib/shikicinema';
import {ALL_ROLES, UserEntity} from '../models/UserEntity';

export class User implements UserDTO {
    id: number;
    login: string;
    name: string;
    email: string;
    roles: Role[];
    createdAt: string;
    shikimoriId: number | null;
    password?: string;

    constructor(
        id: number,
        login: string,
        name: string,
        email: string,
        roles: Role[],
        createdAt: string,
        shikimoriId: number | null = null,
        password: string | undefined = undefined,
    ) {
        this.id = id;
        this.login = login;
        this.name = name;
        this.email = email;
        this.roles = roles;
        this.createdAt = createdAt;
        this.shikimoriId = shikimoriId;
        this.password = password;
    }

    public static toDTO(entity: UserEntity): User {
        return {
            id: entity.id,
            name: entity.name,
            login: entity.login,
            email: entity.email,
            shikimoriId: entity.shikimoriId || null,
            createdAt: entity.createdAt?.toISOString(),
            roles: entity.roles,
        } as UserDTO;
    }

    public static isValidRoles(roles: string[]): boolean {
        try {
            for (const role of roles) {
                if (!User.isValidRole(role)) {
                    return false;
                }
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    public static isValidRole(role: string): boolean {
        return ALL_ROLES.some((r) => r === role);
    }
}
