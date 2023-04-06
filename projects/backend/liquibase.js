/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require('dotenv');
const liquibase = require('liquibase');
const path = require('path');

dotenv.config();

(async () => {
    try {
        const host = process.env.SHIKICINEMA_DB_HOST || 'localhost';
        const port = process.env.SHIKICINEMA_DB_PORT || 5432;
        const database = process.env.SHIKICINEMA_DB_NAME || 'shikicinema-dev';
        const username = process.env.SHIKICINEMA_DB_USER || 'postgres';
        const password = process.env.SHIKICINEMA_DB_PASS || 'postgres';

        await liquibase({
            username,
            password,
            changeLogFile: path.resolve(__dirname, 'migrations', 'index.xml'),
            url: `jdbc:postgresql://${host}:${port}/${database}`,
            classpath: path.resolve('../../node_modules', 'liquibase', 'lib', 'Drivers', 'postgresql-42.2.8.jar'),
        }).run('update');
        console.log('Migration was successful');
    } catch (e) {
        console.error(e);
    }
})();
