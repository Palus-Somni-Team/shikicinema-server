'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('users', 'roles', Sequelize.ARRAY(Sequelize.STRING));
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('users', 'roles');
    },
};
