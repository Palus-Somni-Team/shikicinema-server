# Shikicinema Server

## Requirements

*   PostgreSQL 10+
*   NodeJS 12+

## Build & Deployment

Clone this repository and execute commands from __the project root__:

1.  `npm install`
2.  `npm run build`
3.  `npx sequelize db:migrate`

After that you could run server app by executing: `node dist/bundle.js`
