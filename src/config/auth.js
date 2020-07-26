const isProduction = process.env.NODE_ENV === 'production';

module.exports = Object.freeze({
    PRODUCTION: isProduction,
    AUTH_CODE_LIFE: 10 * 60 * 1000,             // 10 min
    ACCESS_TOKEN_LIFE: 60 * 60 * 1000,          // 1h
    REFRESH_TOKEN_LIFE: 24 * 60 * 60 * 1000,    // 1d
    SESSION_SECRET: isProduction ? process.env.SESSION_SECRET : 'secret',
    COOKIE_SECRET: isProduction ? process.env.COOKIE_SECRET : 'cookie_secret'
});
