# Shikicinema Server

## Requirements

*   PostgreSQL 10+
*   NodeJS 12+

## Build & Deployment

Clone this repository and execute commands from __the project root__:

1.  `npm install`
2.  `npm run build`
3.  Before migration setup database for __PostgreSQL__:
    1.  `psql -U postgres`
    2.  `CREATE DATABASE shikicinema ;`
    3.  Other configurations for different environments you may see in the `config/database.js`.
4.  `npm run migrate`

After that you could run server app by executing: `node dist/bundle.js`
