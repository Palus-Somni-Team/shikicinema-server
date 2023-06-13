import { Role } from '@shikicinema/types';
import { Transform, TransformOptions } from 'class-transformer';

import { UserEntity } from '~backend/entities/user';
import { UserRolesEntity } from '~backend/entities/user-roles';
import { ValidateIf, ValidationOptions } from 'class-validator';

export function TransformNullableString(options?: TransformOptions) {
    return Transform(({ value }) => {
        if (value === undefined) {
            return undefined;
        } else if (value === '' || value === null) {
            return null;
        } else {
            return value;
        }
    }, options);
}

export const userRolesEntityMapToRole = ({ role }: UserRolesEntity): Role => role;

export const roleMapToString = (role: Role): string => Role[role];

export function plainRoleMapToUserRolesEntity(user: UserEntity, roles: Role[]) {
    return roles.map((role) => new UserRolesEntity(user, role));
}

export function TransformRoles() {
    const transform = Transform(
        ({ value }) => value instanceof Array
            ? value.map(roleMapToString)
            : []
    );

    return function(target: any, key: string) {
        transform(target, key);
    };
}

export function TransformDate() {
    const toPlain = Transform(({ value }) => value instanceof Date
        ? value.toISOString()
        : null,
    { toPlainOnly: true }
    );
    const toClass = Transform(({ value }) => value
        ? new Date(value)
        : undefined,
    { toClassOnly: true }
    );

    return function(target: any, key: string) {
        toPlain(target, key);
        toClass(target, key);
    };
}

export function ToBoolean() {
    return Transform(({ value }) => value ? ['1', 1, 'true', true].includes(value) : value);
}

export function IsNullable(validationOptions?: ValidationOptions) {
    return ValidateIf((_, value) => value !== null, validationOptions);
}
