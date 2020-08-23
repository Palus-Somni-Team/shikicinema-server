'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('scopes',
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                value: {
                    allowNull: false,
                    type: Sequelize.STRING,
                },
            });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('scopes');
    },
};
