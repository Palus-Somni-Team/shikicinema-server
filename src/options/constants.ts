import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const configDirEnv = `${process.env.SHIKICINEMA_CONFIG_DIR}`;

export const isProduction = process.env.NODE_ENV === 'production';
export const configDirectory = !!configDirEnv ? configDirEnv : path.resolve('config/');
