'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserScopes', {
      userId: {
        references: {
          model: 'Users',
          key: 'id'
        },
        type: Sequelize.INTEGER
      },
      scopeId: {
        references: {
          model: 'Scopes',
          key: 'id'
        },
        type: Sequelize.INTEGER
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('UserScopes', { cascade: true })
  }
};
