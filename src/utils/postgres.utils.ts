export enum PgException {
  UNIQUE_CONSTRAINS_ERROR = 23505
}

export function isInPgExceptionCodes(code: string) {
  return code in PgException;
}

export function isPgException(e: any, exceptionCode?: PgException): boolean {
  const code: string | undefined = e?.code;

  if (exceptionCode) {
    return !isNaN(+code) && this.isInPgExceptionCodes(code) && +code === exceptionCode;
  }

  return this.isInPgExceptionCodes(code);
}
