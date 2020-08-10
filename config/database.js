require('dotenv').config();
module.exports = {
    development: {
        url: process.env.DEV_DB_URI,
        dialect: 'postgres',
    },
    test: {
        url: process.env.TEST_DB_URI,
        dialect: 'postgres',
    },
    production: {
        url: process.env.PROD_DB_URI,
        dialect: 'postgres',
    },
};
