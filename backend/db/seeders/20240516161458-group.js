'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Groups', [
      {
        organizerId: 1,
        name: 'Group 1',
        about: 'About Group 1',
        type: 'In person',
        private: false,
        city: 'City A',
        state: 'State A'
      },
      {
        organizerId: 2,
        name: 'Group 2',
        about: 'About Group 2',
        type: 'Online',
        private: true,
        city: 'City B',
        state: 'State B'
      },
      {
        organizerId: 3,
        name: 'Group 3',
        about: 'About Group 3',
        type: 'In person',
        private: false,
        city: 'City C',
        state: 'State C'
      },
      {
        organizerId: 4,
        name: 'Group 4',
        about: 'About Group 4',
        type: 'Online',
        private: true,
        city: 'City D',
        state: 'State D'
      },
      {
        organizerId: 5,
        name: 'Group 5',
        about: 'About Group 5',
        type: 'In person',
        private: false,
        city: 'City E',
        state: 'State E'
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Groups', null, {})

  }
};
