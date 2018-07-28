'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('subject_histories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      editor: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      personName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      costumeDescription: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      subjectId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'subjects',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('subject_histories');
  },
};
