import { Test, TestingModule } from '@nestjs/testing';
import { PgSharedService } from './postgres.service';

describe('PostgresSharedService', () => {
  let service: PgSharedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PgSharedService],
    }).compile();

    service = module.get<PgSharedService>(PgSharedService);
  });

  describe('isInPgExceptionCodes', () => {
    const codes = ['23505'];

    for (const code of codes) {
      it('should return true for known error codes', () => {
        expect(service.isInPgExceptionCodes(code)).toBeTruthy();
      });
    }
  });

  describe('isPgException', () => {
    const knownErrorCodes = [
      {
        code: '23505'
      },
      {
        code: 23505,
      },
    ];
    const unknownErrorCodes = [
      {
        code: ''
      },
      {
        code: undefined,
      },
      {
        code: null,
      },
      {
        code: 'abcd'
      },
      {
        code: '0xDEADBEAF' // 3735928495
      },
      {

      },
      null,
      undefined,
    ];

    for (const error of knownErrorCodes) {
      it('should return true for known errors without specified code', () => {
        expect(service.isPgException(error)).toBeTruthy();
      });
    }

    for (const error of unknownErrorCodes) {
      it('should return false for unknown errors', () => {
        expect(service.isPgException(error)).toBeFalsy();
      });
    }
  });
});
