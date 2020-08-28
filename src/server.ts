/* EXTERNAL IMPORTS */
import bodyParser from 'body-parser';
import cors from 'cors';
import express, {NextFunction, Request, Response} from 'express';
import session from 'express-session';
import helmet from 'helmet';
import http from 'http';
import morgan from 'morgan';

/* LOCAL IMPORTS */
import SequelizeStoreConstructor from 'connect-session-sequelize';
import {sequelize} from './sequelize';
import {ServerError} from './types/ServerError';
import {sessionOptions} from './options/SessionOptions';
import * as middleware from './auth/middleware';

/* ROUTES */
import {users} from './routes/users/router';
import {isProduction} from './options/constants';

/* SERVER APP CONSTANTS */
export const app = express();
const SequelizeStore: { new(options: any): any } = SequelizeStoreConstructor(session.Store);
const sessionStorage = new SequelizeStore({db: sequelize, tableName: 'sessions'});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('trust proxy', true);
app.use(morgan(isProduction ? 'combined' : 'dev', {skip: (req, res) => process.env.NODE_ENV === 'test'}));
app.use(session({...sessionOptions, store: sessionStorage}));
app.use(cors());
app.use(helmet({
    hsts: false, // disabled because of nginx configuration
}));
app.use(middleware.destroyInvalidCookies);

app.use('/api/users/', users);

app.all('*', (req: Request, res: Response) => {
    res.status(404).send({});
});

app.use((err: ServerError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500).send({
        error: err.brief,
        message: isProduction ? err.message : err.toString(),
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
