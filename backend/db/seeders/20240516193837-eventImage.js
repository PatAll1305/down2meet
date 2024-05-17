'use strict';
const { EventImage } = require('../models');

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
    await EventImage.bulkCreate([
      {
        eventId: 1,
        url: 'https://example.com/event1_image.jpg',
        preview: true
      },
      {
        eventId: 2,
        url: 'https://example.com/event2_image.jpg',
        preview: true
      },
      {
        eventId: 3,
        url: 'https://example.com/event3_image.jpg',
        preview: true
      },
      {
        eventId: 4,
        url: 'https://example.com/event4_image.jpg',
        preview: true
      },
      {
        eventId: 5,
        url: 'https://example.com/event5_image.jpg',
        preview: true
      },
      {
        eventId: 6,
        url: 'https://example.com/event6_image.jpg',
        preview: true
      },
      {
        eventId: 7,
        url: 'https://example.com/event7_image.jpg',
        preview: true
      },
      {
        eventId: 8,
        url: 'https://example.com/event8_image.jpg',
        preview: true
      },
      {
        eventId: 9,
        url: 'https://example.com/event9_image.jpg',
        preview: true
      },
      {
        eventId: 10,
        url: 'https://example.com/event10_image.jpg',
        preview: true
      },
      {
        eventId: 11,
        url: 'https://example.com/event11_image.jpg',
        preview: true
      },
      {
        eventId: 12,
        url: 'https://example.com/event12_image.jpg',
        preview: true
      },
      {
        eventId: 13,
        url: 'https://example.com/event13_image.jpg',
        preview: true
      },
      {
        eventId: 14,
        url: 'https://example.com/event14_image.jpg',
        preview: true
      },
      {
        eventId: 15,
        url: 'https://example.com/event15_image.jpg',
        preview: true
      },
      {
        eventId: 16,
        url: 'https://example.com/event16_image.jpg',
        preview: true
      },
      {
        eventId: 17,
        url: 'https://example.com/event17_image.jpg',
        preview: true
      },
      {
        eventId: 18,
        url: 'https://example.com/event18_image.jpg',
        preview: true
      },
      {
        eventId: 19,
        url: 'https://example.com/event19_image.jpg',
        preview: true
      },
      {
        eventId: 20,
        url: 'https://example.com/event20_image.jpg',
        preview: true
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
    await queryInterface.bulkDelete('EventImages', null, {})
  }
};
