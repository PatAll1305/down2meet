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
    await queryInterface.bulkInsert('Memberships', [
      {
        userId: 1,
        groupId: 1,
        status: 'member'
      },
      {
        userId: 2,
        groupId: 1,
        status: 'co-host'
      },
      {
        userId: 3,
        groupId: 2,
        status: 'pending'
      },
      {
        userId: 4,
        groupId: 2,
        status: 'member'
      },
      {
        userId: 5,
        groupId: 3,
        status: 'organizer'
      },
      {
        userId: 6,
        groupId: 3,
        status: 'pending'
      },
      {
        userId: 7,
        groupId: 4,
        status: 'member'
      },
      {
        userId: 8,
        groupId: 4,
        status: 'co-host'
      },
      {
        userId: 9,
        groupId: 5,
        status: 'pending'
      },
      {
        userId: 10,
        groupId: 5,
        status: 'member'
      },
      {
        userId: 11,
        groupId: 1,
        status: 'member'
      },
      {
        userId: 12,
        groupId: 1,
        status: 'co-host'
      },
      {
        userId: 13,
        groupId: 2,
        status: 'pending'
      },
      {
        userId: 14,
        groupId: 3,
        status: 'member'
      },
      {
        userId: 15,
        groupId: 4,
        status: 'organizer'
      },
      {
        userId: 16,
        groupId: 5,
        status: 'pending'
      },
      {
        userId: 17,
        groupId: 1,
        status: 'member'
      },
      {
        userId: 18,
        groupId: 2,
        status: 'co-host'
      },
      {
        userId: 19,
        groupId: 3,
        status: 'pending'
      },
      {
        userId: 20,
        groupId: 4,
        status: 'member'
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
    await queryInterface.bulkDelete('Memberships', null, {})
  }
};
