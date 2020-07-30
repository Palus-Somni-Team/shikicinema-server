// TODO: clean up

/* EXTERNAL IMPORTS */
import bodyParser from 'body-parser';
import cors from 'cors';
import express, {Request, Response} from 'express';
import session from 'express-session';
import helmet from 'helmet';
import http from 'http';
import morgan from 'morgan';

/* LOCAL IMPORTS */
import {sequelize} from './sequelize';
import {ServerError} from './types/ServerError';
import * as middleware from './auth/middleware';

/* ROUTES */
import {users} from './routes/users';

/* SERVER APP CONSTANTS */
const app = express();
const {SESSION_SECRET, PRODUCTION} = require('./config/auth');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sessionStorage = new SequelizeStore({ db: sequelize, tableName: 'Sessions' });

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('trust proxy', true);
app.use(morgan(PRODUCTION ? 'combined' : 'dev'));
app.use(session({
    name: 'user_sid',
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        httpOnly: true,
        // secure: PRODUCTION, // removed because of nginx configuration
        sameSite: 'lax',
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // expires in 24h
    },
    store: sessionStorage,
}));
app.use(cors());
app.use(helmet({
    hsts: false, // disabled because of nginx configuration
}));
app.use(middleware.destroyInvalidCookies);

app.use('/api/users/', users);

app.all('*', (req: Request, res: Response) => {
    res.status(404).send({});
});

app.use((err: ServerError, req: Request, res: Response, next: Function) => {
    res.status(err.status || 500).send({
        error: err.brief,
        message: PRODUCTION ? err.message : err.toString(),
    });
});

/* SERVER STARTUP */
(async () => {
    try {
        await sessionStorage.sync();
        await sequelize.authenticate();

        http.createServer(app)
            .listen(process.env.HTTP_PORT || '3001');
    } catch (err) {
        console.error(err);
    }
})();
