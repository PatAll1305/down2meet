'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      venueId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      groupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
      },
      type: {
        type: Sequelize.ENUM({ values: ['Online', 'In Person', 'online', 'in person', 'In person'] }),
        allowNull: false,
      },
      capacity: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0
      },
      startDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      endDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdAt: {
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        type: Sequelize.DATE
      },
      updatedAt: {
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        type: Sequelize.DATE
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Events";
    return queryInterface.dropTable(options);;
  }
};