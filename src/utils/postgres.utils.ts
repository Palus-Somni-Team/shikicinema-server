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

export function removeUndefinedWhereFields(obj: any): any {
    for (const [key, value] of Object.entries(obj)) {
        if (value === undefined) {
            delete obj[key];
        }
    }

    return obj;
}
