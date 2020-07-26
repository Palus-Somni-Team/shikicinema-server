const path = require('path');

module.exports = {
    'config': path.resolve('config', 'config.js'),
    'models-path': path.resolve('./src/models'),
    'migrations-path': path.resolve('./migrations')
};
