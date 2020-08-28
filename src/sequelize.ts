import {Sequelize, SequelizeOptions} from 'sequelize-typescript';
import dotenv from 'dotenv';
import {models} from './models';
import {databaseOptions} from './options/DatabaseOptions';

dotenv.config();

const dbUri = `${process.env[databaseOptions.use_env_variable]}`;
const options = {...databaseOptions, models} as SequelizeOptions;

export const sequelize = new Sequelize(dbUri, options);
