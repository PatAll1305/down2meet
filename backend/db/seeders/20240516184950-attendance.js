'use strict';
const { Attendance } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
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
    await Attendance.bulkCreate([
      {
        eventId: 1,
        userId: 1,
        status: 'attending'
      },
      {
        eventId: 1,
        userId: 2,
        status: 'pending'
      },
      {
        eventId: 1,
        userId: 3,
        status: 'waitlist'
      },
      {
        eventId: 2,
        userId: 4,
        status: 'attending'
      },
      {
        eventId: 2,
        userId: 5,
        status: 'pending'
      },
      {
        eventId: 2,
        userId: 6,
        status: 'waitlist'
      },
      {
        eventId: 3,
        userId: 7,
        status: 'attending'
      },
      {
        eventId: 3,
        userId: 8,
        status: 'pending'
      },
      {
        eventId: 3,
        userId: 9,
        status: 'waitlist'
      },
      {
        eventId: 4,
        userId: 10,
        status: 'attending'
      },
      {
        eventId: 5,
        userId: 11,
        status: 'attending'
      },
      {
        eventId: 5,
        userId: 12,
        status: 'pending'
      },
      {
        eventId: 5,
        userId: 13,
        status: 'waitlist'
      },
      {
        eventId: 6,
        userId: 14,
        status: 'attending'
      },
      {
        eventId: 6,
        userId: 15,
        status: 'pending'
      },
      {
        eventId: 6,
        userId: 16,
        status: 'waitlist'
      },
      {
        eventId: 7,
        userId: 17,
        status: 'attending'
      },
      {
        eventId: 7,
        userId: 18,
        status: 'pending'
      },
      {
        eventId: 7,
        userId: 19,
        status: 'waitlist'
      },
      {
        eventId: 8,
        userId: 20,
        status: 'attending'
      },
      {
        eventId: 8,
        userId: 1,
        status: 'pending'
      },
      {
        eventId: 8,
        userId: 2,
        status: 'waitlist'
      },
      {
        eventId: 9,
        userId: 3,
        status: 'attending'
      },
      {
        eventId: 9,
        userId: 4,
        status: 'pending'
      },
      {
        eventId: 9,
        userId: 5,
        status: 'waitlist'
      },
      {
        eventId: 10,
        userId: 6,
        status: 'attending'
      },
      {
        eventId: 10,
        userId: 7,
        status: 'pending'
      },
      {
        eventId: 10,
        userId: 8,
        status: 'waitlist'
      },
      {
        eventId: 11,
        userId: 9,
        status: 'attending'
      },
      {
        eventId: 11,
        userId: 10,
        status: 'pending'
      },
      {
        eventId: 11,
        userId: 11,
        status: 'waitlist'
      },
      {
        eventId: 12,
        userId: 12,
        status: 'attending'
      },
      {
        eventId: 12,
        userId: 13,
        status: 'pending'
      },
      {
        eventId: 12,
        userId: 14,
        status: 'waitlist'
      },
      {
        eventId: 13,
        userId: 15,
        status: 'attending'
      },
      {
        eventId: 14,
        userId: 16,
        status: 'attending'
      },
      {
        eventId: 14,
        userId: 17,
        status: 'pending'
      },
      {
        eventId: 14,
        userId: 18,
        status: 'waitlist'
      },
      {
        eventId: 15,
        userId: 19,
        status: 'attending'
      },
      {
        eventId: 15,
        userId: 20,
        status: 'pending'
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
    await queryInterface.bulkDelete('Attendances', null, {})

  }
};
