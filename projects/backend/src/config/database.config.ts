import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { registerAs } from '@nestjs/config';

import {
    AuthorsSeed1621024400000,
    SessionSeed1607704017485,
    UploadTokenSeed1650995411336,
    UploaderSeed1621024303293,
    UserRolesSeed1607357974820,
    UserSeed1607357974819,
    VideoRequestsSeed1650995411337,
    VideoSeed1621024590642,
} from '~backend-root/seeds';
import { entities } from '~backend/entities';

export default registerAs('database', () => {
    const postgresConfig: PostgresConnectionOptions = {
        type: 'postgres',
        host: process.env.SHIKICINEMA_DB_HOST || 'localhost',
        port: Number(process.env.SHIKICINEMA_DB_PORT) || 5432,
        database: process.env.SHIKICINEMA_DB_NAME || 'shikicinema-dev',
        username: process.env.SHIKICINEMA_DB_USER || 'postgres',
        password: process.env.SHIKICINEMA_DB_PASS || 'postgres',
        logging: !!process.env.SHIKICINEMA_DB_LOG,
        synchronize: !!process.env.SHIKICINEMA_DB_SYNC,
        entities,
        // see: https://orkhan.gitbook.io/typeorm/docs/data-source-options#common-data-source-options (entitySkipConstructor)
        entitySkipConstructor: true,
    };

    const inMemoryConfig: SqliteConnectionOptions = {
        type: 'sqlite',
        database: ':memory:',
        entities,
        logging: false,
        synchronize: true,
        migrations: [
            UserSeed1607357974819,
            SessionSeed1607704017485,
            UploaderSeed1621024303293,
            AuthorsSeed1621024400000,
            VideoSeed1621024590642,
            UploadTokenSeed1650995411336,
            UserRolesSeed1607357974820,
            VideoRequestsSeed1650995411337,
        ],
        entitySkipConstructor: true,
    };

    return process.env.NODE_ENV === 'testing' ? inMemoryConfig : postgresConfig;
});
