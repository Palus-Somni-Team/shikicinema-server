# Shikicinema Server

## Requirements

*   PostgreSQL 10+
*   NodeJS ^12.10.0

## Build & Deployment

Clone this repository and execute commands from __the project root__:

1.  `npm install`
2.  `npm run build`
3.  Setup database with `docker-compose up` or do it manually:
    1.  `psql -U postgres`
    2.  `CREATE DATABASE shikicinema-dev;`
    4.  Use `.env` to set up environment variables.
    3.  `npm run migrate`

After that you could run server app by executing: `node dist/bundle.js`
