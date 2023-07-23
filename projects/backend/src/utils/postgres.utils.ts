import { In } from 'typeorm';

export enum PgException {
    UNIQUE_CONSTRAINS_ERROR = 23505
}

export function isInPgExceptionCodes(code: string) {
    return code in PgException;
}

export function isPgException(e: any, exceptionCode?: PgException): boolean {
    const code: string | undefined = e?.code;

    if (exceptionCode) {
        return !isNaN(+code) && isInPgExceptionCodes(code) && +code === exceptionCode;
    }

    return isInPgExceptionCodes(code);
}

export function normalizeString(value?: string): string {
    return (value || '').trim().toUpperCase();
}

/**
 * Removes all undefined fields and replace array values with typeorm.In(value).
 * @param {any} obj plain object.
 * @return {any} where condition for sql query.
 */
export function toSqlWhere(obj: any): any {
    for (const [key, value] of Object.entries(obj)) {
        if (value === undefined) {
            delete obj[key];
            continue;
        }

        if (value instanceof Array) {
            obj[key] = In(value);
        }
    }

    return obj;
}
