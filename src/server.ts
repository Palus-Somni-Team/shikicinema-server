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
import SequelizeStoreConstructor from 'connect-session-sequelize';
import {sequelize} from './sequelize';
import {ServerError} from './types/ServerError';
import SERVER_CONFIG from '../config/auth';
import * as middleware from './auth/middleware';

/* ROUTES */
import {users} from './routes/users';

/* SERVER APP CONSTANTS */
const app = express();
const SequelizeStore: { new(options: any): any } = SequelizeStoreConstructor(session.Store);
const sessionStorage = new SequelizeStore({db: sequelize, tableName: 'sessions'});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('trust proxy', true);
app.use(morgan(SERVER_CONFIG.isProduction ? 'combined' : 'dev'));
app.use(session({
    name: 'user_sid',
    secret: SERVER_CONFIG.sessionSecret,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        httpOnly: true,
        // secure: PRODUCTION, // removed because of nginx configuration
        sameSite: 'lax',
        expires: new Date(Date.now() + SERVER_CONFIG.cookieLife),
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
        message: SERVER_CONFIG.isProduction ? err.message : err.toString(),
    });
});

/* SERVER STARTUP */
(async (): Promise<void> => {
    try {
        await sessionStorage.sync();
        await sequelize.authenticate();

        http.createServer(app)
            .listen(process.env.HTTP_PORT || '3001');
    } catch (err) {
        console.error(err);
    }
})();
