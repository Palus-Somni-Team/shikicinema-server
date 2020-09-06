const dotenv = require('dotenv');
const liquibase = require('liquibase');
const path = require('path');

dotenv.config();

(async () => {
  try {
    const args = process.argv.slice(2);
    const database = args[0] || 'shikicinema-dev';
    await liquibase({
      changeLogFile: path.resolve('migrations', 'index.xml'),
      username: 'postgres',
      password: 'postgres',
      url: `jdbc:postgresql://127.0.0.1:5432/${database}`,
      classpath: path.resolve('node_modules', 'liquibase', 'lib', 'Drivers', 'postgresql-42.2.8.jar'),
    }).run('update');
    console.log('Migration was successful');
  } catch (e) {
    console.error(e);
  }
})();
