import { Role } from '@lib-shikicinema';
import { Transform, TransformOptions } from 'class-transformer';

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

export function TransformRoles() {
    const toPlain = Transform(
        ({ value }) => value instanceof Array
            ? value.map((role) => Role[Role[role]])
            : [],
        { toPlainOnly: true }
    );

    const toClass = Transform(
        ({ value }) => value instanceof Array
            ? value.map((role) => Role[role])
            : [],
        { toClassOnly: true }
    );

    return function(target: any, key: string) {
        toPlain(target, key);
        toClass(target, key);
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
