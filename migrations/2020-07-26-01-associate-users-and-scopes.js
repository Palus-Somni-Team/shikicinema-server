'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('user_scopes',
            {
                user_id: {
                    references: {
                        model: 'users',
                        key: 'id',
                    },
                    type: Sequelize.INTEGER,
                },
                scope_id: {
                    references: {
                        model: 'scopes',
                        key: 'id',
                    },
                    type: Sequelize.INTEGER,
                },
            });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('user_scopes');
    },
};
