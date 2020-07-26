import {Sequelize} from 'sequelize-typescript';
import {models} from './models';

const configs = require('../config/config.js')
const env = process.env.NODE_ENV || 'development';
const config = (configs as any)[env];

export const sequelize = new Sequelize({
    dialect: config.dialect,
    database: config.database,
    host: config.host,
    username: config.username,
    password: config.password,
    models
});
