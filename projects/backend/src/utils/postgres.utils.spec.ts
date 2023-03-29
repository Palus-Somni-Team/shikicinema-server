import { isInPgExceptionCodes, isPgException } from '~backend/utils/postgres.utils';

describe('Postgres utils', () => {
    describe('isInPgExceptionCodes', () => {
        const codes = ['23505'];

        for (const code of codes) {
            it('should return true for known error codes', () => {
                expect(isInPgExceptionCodes(code))
                    .toBeTruthy();
            });
        }
    });

    describe('isPgException', () => {
        const knownErrorCodes = [
            { code: '23505' },
            { code: 23505 },
        ];
        const unknownErrorCodes = [
            { code: '' },
            { code: undefined },
            { code: null },
            { code: 'abcd' },
            // 3735928495
            { code: '0xDEADBEAF' },
            {},
            null,
            undefined,
        ];

        for (const error of knownErrorCodes) {
            it('should return true for known errors without specified code', () => {
                expect(isPgException(error))
                    .toBeTruthy();
            });
        }

        for (const error of unknownErrorCodes) {
            it('should return false for unknown errors', () => {
                expect(isPgException(error))
                    .toBeFalsy();
            });
        }
    });
});
