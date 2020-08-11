import dotenv from 'dotenv';

dotenv.config();

export const isProduction = process.env.NODE_ENV === 'production';

const configDirEnv = `${process.env.SHIKICINEMA_CONFIG_DIR}`;
export const configDirectory = !!configDirEnv ? './config' : configDirEnv;
