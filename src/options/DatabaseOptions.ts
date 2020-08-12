import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import {configDirectory} from './constants';

export interface DatabaseOptions {
    use_env_variable: string; // have to use this because of sequelize migration
    dialect: string;
}

dotenv.config();
const json = fs.readFileSync(path.resolve(configDirectory, 'database.json'));
const options = JSON.parse(json.toString()) as DatabaseOptions;
export const databaseOptions = options;
