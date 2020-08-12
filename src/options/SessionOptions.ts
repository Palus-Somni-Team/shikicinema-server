import fs from 'fs';
import dotenv from 'dotenv';
import {configDirectory} from './constants';
import path from 'path';

export interface SessionOptions {
    secret: string | string[];
    name: string;
    proxy: boolean;
    resave: boolean;
    saveUninitialized: boolean;

    cookie: {
        maxAge: number; // in milliseconds
        httpOnly: boolean;
        sameSite: boolean | 'lax' | 'strict' | 'none';
    };
}

dotenv.config();
const json = fs.readFileSync(path.resolve(configDirectory, 'session.json'));
const options = JSON.parse(json.toString()) as SessionOptions;
const secretEnv = `${process.env.SHIKICINEMA_SESSIONS_SECRET}`;
options.secret = !!secretEnv ? options.secret : secretEnv;

export const sessionOptions = options;
