/* eslint-disable */
'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('episodes',
            {
                id: {
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                    type: Sequelize.INTEGER,
                },
                anime_id: {
                    allowNull: false,
                    type: Sequelize.INTEGER,
                },
                number: {
                    allowNull: false,
                    type: Sequelize.SMALLINT,
                },
            },
            {
                indexes: [
                    {
                        unique: true,
                        fields: ['anime_id', 'number'],
                    },
                ],
            });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('episodes');
    },
};
