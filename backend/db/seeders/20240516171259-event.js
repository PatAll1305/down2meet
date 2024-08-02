'use strict';
const { Event } = require('../models')

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
    await Event.bulkCreate([
      {
        venueId: 1,
        groupId: 1,
        name: 'Event 1',
        description: 'Description for Event 1',
        type: 'Online',
        capacity: 100,
        price: 20,
        startDate: new Date('2024-05-20T08:00:00Z'),
        endDate: new Date('2024-05-20T18:00:00Z')
      },
      {
        venueId: 2,
        groupId: 2,
        name: 'Event 2',
        description: 'Description for Event 2',
        type: 'In Person',
        capacity: 50,
        price: 15,
        startDate: new Date('2024-06-10T10:00:00Z'),
        endDate: new Date('2024-06-10T20:00:00Z')
      },
      {
        venueId: 3,
        groupId: 3,
        name: 'Event 3',
        description: 'Description for Event 3',
        type: 'Online',
        capacity: 80,
        price: 25,
        startDate: new Date('2024-07-15T09:00:00Z'),
        endDate: new Date('2024-07-15T17:00:00Z')
      },
      {
        venueId: 4,
        groupId: 4,
        name: 'Event 4',
        description: 'Description for Event 4',
        type: 'In Person',
        capacity: 120,
        price: 30,
        startDate: new Date('2024-08-05T11:00:00Z'),
        endDate: new Date('2024-08-05T21:00:00Z')
      },
      {
        venueId: 5,
        groupId: 5,
        name: 'Event 5',
        description: 'Description for Event 5',
        type: 'Online',
        capacity: 70,
        price: 18,
        startDate: new Date('2024-09-20T10:30:00Z'),
        endDate: new Date('2024-09-20T19:30:00Z')
      },
      {
        venueId: 6,
        groupId: 1,
        name: 'Event 6',
        description: 'Description for Event 6',
        type: 'In Person',
        capacity: 90,
        price: 22,
        startDate: new Date('2024-10-10T08:00:00Z'),
        endDate: new Date('2024-10-10T18:00:00Z')
      },
      {
        venueId: 7,
        groupId: 2,
        name: 'Event 7',
        description: 'Description for Event 7',
        type: 'Online',
        capacity: 60,
        price: 17,
        startDate: new Date('2024-11-05T09:00:00Z'),
        endDate: new Date('2024-11-05T19:00:00Z')
      },
      {
        venueId: 8,
        groupId: 3,
        name: 'Event 8',
        description: 'Description for Event 8',
        type: 'In Person',
        capacity: 110,
        price: 28,
        startDate: new Date('2024-12-15T10:00:00Z'),
        endDate: new Date('2024-12-15T20:00:00Z')
      },
      {
        venueId: 9,
        groupId: 4,
        name: 'Event 9',
        description: 'Description for Event 9',
        type: 'Online',
        capacity: 75,
        price: 19,
        startDate: new Date('2025-01-20T11:00:00Z'),
        endDate: new Date('2025-01-20T21:00:00Z')
      },
      {
        venueId: 10,
        groupId: 5,
        name: 'Event 10',
        description: 'Description for Event 10',
        type: 'In Person',
        capacity: 95,
        price: 23,
        startDate: new Date('2025-02-10T12:00:00Z'),
        endDate: new Date('2025-02-10T22:00:00Z')
      }, {
        venueId: 11,
        groupId: 1,
        name: 'Event 11',
        description: 'Description for Event 11',
        type: 'Online',
        capacity: 85,
        price: 21,
        startDate: new Date('2025-03-15T13:00:00Z'),
        endDate: new Date('2025-03-15T23:00:00Z')
      },
      {
        venueId: 12,
        groupId: 2,
        name: 'Event 12',
        description: 'Description for Event 12',
        type: 'In Person',
        capacity: 65,
        price: 16,
        startDate: new Date('2025-04-20T14:00:00Z'),
        endDate: new Date('2025-04-20T22:00:00Z')
      },
      {
        venueId: 13,
        groupId: 3,
        name: 'Event 13',
        description: 'Description for Event 13',
        type: 'Online',
        capacity: 105,
        price: 27,
        startDate: new Date('2025-05-10T15:00:00Z'),
        endDate: new Date('2025-05-10T21:00:00Z')
      },
      {
        venueId: 14,
        groupId: 4,
        name: 'Event 14',
        description: 'Description for Event 14',
        type: 'In Person',
        capacity: 55,
        price: 14,
        startDate: new Date('2025-06-05T16:00:00Z'),
        endDate: new Date('2025-06-05T20:00:00Z')
      },
      {
        venueId: 15,
        groupId: 5,
        name: 'Event 15',
        description: 'Description for Event 15',
        type: 'Online',
        capacity: 125,
        price: 32,
        startDate: new Date('2025-07-10T17:00:00Z'),
        endDate: new Date('2025-07-10T23:00:00Z')
      }, {
        venueId: 16,
        groupId: 1,
        name: 'Event 16',
        description: 'Description for Event 16',
        type: 'In Person',
        capacity: 70,
        price: 18,
        startDate: new Date('2025-08-15T18:00:00Z'),
        endDate: new Date('2025-08-15T22:00:00Z')
      },
      {
        venueId: 17,
        groupId: 2,
        name: 'Event 17',
        description: 'Description for Event 17',
        type: 'Online',
        capacity: 90,
        price: 23,
        startDate: new Date('2025-09-20T19:00:00Z'),
        endDate: new Date('2025-09-20T23:00:00Z')
      },
      {
        venueId: 18,
        groupId: 3,
        name: 'Event 18',
        description: 'Description for Event 18',
        type: 'In Person',
        capacity: 110,
        price: 28,
        startDate: new Date('2025-10-10T20:00:00Z'),
        endDate: new Date('2025-10-10T23:59:59Z')
      },
      {
        venueId: 19,
        groupId: 4,
        name: 'Event 19',
        description: 'Description for Event 19',
        type: 'Online',
        capacity: 60,
        price: 15,
        startDate: new Date('2025-11-05T21:00:00Z'),
        endDate: new Date('2025-11-05T23:00:00Z')
      },
      {
        venueId: 20,
        groupId: 5,
        name: 'Event 20',
        description: 'Description for Event 20',
        type: 'In Person',
        capacity: 80,
        price: 20,
        startDate: new Date('2025-12-10T22:00:00Z'),
        endDate: new Date('2025-12-10T23:59:59Z')
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Events', null, {})
  }
};
