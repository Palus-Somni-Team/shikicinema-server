import { APP_FILTER } from '@nestjs/core';
import { Provider } from '@nestjs/common';

import { PostgresExceptionFilter } from '~backend/exception-filters/orm/postgres.exception-filter';
import { SqliteExceptionFilter } from '~backend/exception-filters/orm/sqlite.exception-filter';

export const OrmExceptionFilterFactory: Provider = {
    provide: APP_FILTER,
    useFactory: () => process.env.NODE_ENV === 'testing'
        ? new SqliteExceptionFilter()
        : new PostgresExceptionFilter(),
};
