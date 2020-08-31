'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addIndex('users', ['login'], {
                fields: 'login',
                unique: true,
            }),
            queryInterface.addIndex('users', ['email'], {
                fields: 'email',
                unique: true,
            }),
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeIndex('users', ['login'], {
                fields: 'login',
                unique: false,
            }),
            queryInterface.removeIndex('users', ['email'], {
                fields: 'email',
                unique: false,
            }),
        ]);
    },
};
