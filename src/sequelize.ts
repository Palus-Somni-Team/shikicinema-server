import {Sequelize, SequelizeOptions} from 'sequelize-typescript';
import dotenv from 'dotenv';
import {models} from './models';
import configs, {DatabaseConfig, DatabaseConfigs} from '../config/database';

dotenv.config();

const env = process.env.NODE_ENV || 'development';
const config: DatabaseConfig = (configs as DatabaseConfigs)[env];
const dbUri = config.url;
const options: SequelizeOptions = {models};

export const sequelize = new Sequelize(dbUri, options);
