import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { entities } from '@app-entities';
import { registerAs } from '@nestjs/config';

import { SessionSeed1607704017485 } from '@app-seeds/1607704017485-session-seed';
import { UploadTokenSeed1650995411336 } from '@app-seeds/1650995411336-upload-token-seed';
import { UploaderSeed1621024303293 } from '@app-seeds/1621024303293-uploader-seed';
import { UserSeed21607357974819 } from '@app-seeds/1607357974819-user-seed';
import { VideoSeed1621024590642 } from '@app-seeds/1621024590642-video-seed';

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
    };

    const inMemoryConfig: SqliteConnectionOptions = {
        type: 'sqlite',
        database: ':memory:',
        entities,
        logging: false,
        synchronize: true,
        migrations: [
            UserSeed21607357974819,
            SessionSeed1607704017485,
            UploaderSeed1621024303293,
            VideoSeed1621024590642,
            UploadTokenSeed1650995411336,
        ],
    };

    return process.env.NODE_ENV === 'testing' ? inMemoryConfig : postgresConfig;
});
