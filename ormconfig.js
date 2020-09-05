const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const DEFAULT_CONFIG_DIR = path.resolve('config', 'development');
const dbConfigDir = `${process.env.SHIKICINEMA_CONFIG_DIR || DEFAULT_CONFIG_DIR}`;
const dbConfigPath = path.resolve(dbConfigDir, 'database.json');
const dbConfig = JSON.parse(fs.readFileSync(dbConfigPath, { encoding: 'utf8' }));
const dbUri = `${process.env[dbConfig.env]}`;

module.exports = {
  type: 'postgres',
  url: dbUri,
  entities: [
    'dist/**/*.entity{.ts,.js}',
  ],
  logging: dbConfig.logging,
  synchronize: false,
};
