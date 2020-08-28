'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('scopes', [
            {
                id: 1,
                value: 'admin',
            },
            {
                id: 2,
                value: 'banned',
            },
            {
                id: 3,
                value: 'user',
            },
        ], {});
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('scopes', null, {});
    },
};
