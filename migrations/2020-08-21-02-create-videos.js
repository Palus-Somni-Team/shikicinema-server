/* eslint-disable */
'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('videos',
            {
                id: {
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                    type: Sequelize.INTEGER,
                },
                url: {
                    unique: true,
                    allowNull: false,
                    type: Sequelize.STRING(512),
                },
                episode_id: {
                    allowNull: false,
                    type: Sequelize.SMALLINT,
                },
                kind: {
                    allowNull: false,
                    type: Sequelize.SMALLINT,
                },
                language: {
                    allowNull: false,
                    type: Sequelize.STRING(16),
                },
                quality: {
                    allowNull: false,
                    defaultValue: 0,
                    type: Sequelize.SMALLINT,
                },
                author: {
                    allowNull: false,
                    type: Sequelize.STRING(512),
                },
                created_at: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
                updated_at: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
                uploader: {
                    allowNull: false,
                    type: Sequelize.INTEGER,
                },
                watchesCount: {
                    allowNull: false,
                    defaultValue: 0,
                    type: Sequelize.INTEGER,
                },
            });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('videos');
    },
};
