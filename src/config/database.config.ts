import { registerAs } from '@nestjs/config';
import EntitiesConfig from './entities.config';

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
};

export default registerAs('database', () => process.env.NODE_ENV === 'testing' ? inMemoryConfig : postgresConfig);
