import { registerAs } from '@nestjs/config';
import EntitiesConfig from './entities.config';
import { UserSeed21607357974819 } from '../../seeds/1607357974819-user-seed';
import { SessionSeed1607704017485 } from '../../seeds/1607704017485-session-seed';

export default registerAs('database', () => {
    const postgresConfig = {
        type:         process.env.SHIKICINEMA_DB_TYPE || 'postgres',
        host:         process.env.SHIKICINEMA_DB_HOST || 'localhost',
        port:         process.env.SHIKICINEMA_DB_PORT || 5432,
        database:     process.env.SHIKICINEMA_DB_NAME || 'shikicinema-dev',
        username:     process.env.SHIKICINEMA_DB_USER || 'postgres',
        password:     process.env.SHIKICINEMA_DB_PASS || 'postgres',
        logging:      process.env.SHIKICINEMA_DB_LOG || false,
        synchronize:  process.env.SHIKICINEMA_DB_SYNC || false,
        entities:     EntitiesConfig,
    };

    const inMemoryConfig = {
        type: 'sqlite',
        database: ':memory:',
        entities: EntitiesConfig,
        logging: false,
        synchronize: true,
        migrations: [ UserSeed21607357974819, SessionSeed1607704017485 ]
    };

    return process.env.NODE_ENV === 'testing' ? inMemoryConfig : postgresConfig
});
