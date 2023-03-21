import * as dotenv from 'dotenv';
import { SessionOptions } from 'express-session';
import { registerAs } from '@nestjs/config';

dotenv.config();
export default registerAs('express-session', () => ({
    name: 'sid',
    secret: process.env.SESSION_SECRET || 'SESSION_SECRET',
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: {
        secure: process.env.SESSION_SECURE === 'true',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: process.env.SESSION_MAX_AGE || 24 * 60 * 60 * 1000,
    },
} as SessionOptions));
