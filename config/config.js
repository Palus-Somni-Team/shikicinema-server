require('dotenv').config();

module.exports = {
    development: {
        username: "postgres",
        password: null,
        database: "shikicinema",
        host: "127.0.0.1",
        dialect: "postgres"
    },
    test: {
        username: "postgres",
        password: null,
        database: "shikicinema_test",
        host: "127.0.0.1",
        dialect: "postgres"
    },
    production: {
        use_env_variable: 'DATABASE_URL',
        dialect: "postgres"
    }
};
