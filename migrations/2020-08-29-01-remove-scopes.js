'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.dropTable('scopes', {cascade: true}),
            queryInterface.dropTable('user_scopes', {cascade: true}),
        ]);
    },
};
