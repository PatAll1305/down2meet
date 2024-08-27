'use strict';
const { Venue } = require('../models')

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
    await Venue.bulkCreate([
      {
        groupId: 1,
        address: '123 Main Street',
        city: 'City A',
        state: 'State A',
        lat: 86.456,
        lng: -78.901
      },
      {
        groupId: 2,
        address: '456 Elm Street',
        city: 'City B',
        state: 'State B',
        lat: 50.567,
        lng: -89.012
      },
      {
        groupId: 3,
        address: '789 Oak Street',
        city: 'City C',
        state: 'State C',
        lat: 70.678,
        lng: -90.123
      },
      {
        groupId: 4,
        address: '101 Pine Street',
        city: 'City D',
        state: 'State D',
        lat: 43.789,
        lng: -100.234
      },
      {
        groupId: 5,
        address: '202 Maple Street',
        city: 'City E',
        state: 'State E',
        lat: 28.890,
        lng: -110.345
      },
      {
        groupId: 1,
        address: '303 Cedar Street',
        city: 'City F',
        state: 'State F',
        lat: 42.901,
        lng: -120.456
      },
      {
        groupId: 2,
        address: '404 Walnut Street',
        city: 'City G',
        state: 'State G',
        lat: 79.012,
        lng: -130.567
      },
      {
        groupId: 3,
        address: '505 Birch Street',
        city: 'City H',
        state: 'State H',
        lat: 80.123,
        lng: -140.678
      },
      {
        groupId: 4,
        address: '606 Ash Street',
        city: 'City I',
        state: 'State I',
        lat: 1.234,
        lng: -150.789
      },
      {
        groupId: 5,
        address: '707 Poplar Street',
        city: 'City J',
        state: 'State J',
        lat: 12.345,
        lng: -160.890
      },
      {
        groupId: 1,
        address: '808 Pineapple Street',
        city: 'City K',
        state: 'State K',
        lat: 23.456,
        lng: -170.901
      },
      {
        groupId: 2,
        address: '909 Mango Street',
        city: 'City L',
        state: 'State L',
        lat: 34.567,
        lng: -18.012
      },
      {
        groupId: 3,
        address: '1010 Coconut Street',
        city: 'City M',
        state: 'State M',
        lat: 45.678,
        lng: -10.123
      },
      {
        groupId: 4,
        address: '1111 Banana Street',
        city: 'City N',
        state: 'State N',
        lat: 56.789,
        lng: -20.234
      },
      {
        groupId: 5,
        address: '1212 Papaya Street',
        city: 'City O',
        state: 'State O',
        lat: 67.890,
        lng: -21.345
      }, {
        groupId: 1,
        address: '1313 Guava Street',
        city: 'City P',
        state: 'State P',
        lat: 78.901,
        lng: -22.456
      },
      {
        groupId: 2,
        address: '1414 Kiwi Street',
        city: 'City Q',
        state: 'State Q',
        lat: 69.012,
        lng: -30.567
      },
      {
        groupId: 3,
        address: '1515 Dragonfruit Street',
        city: 'City R',
        state: 'State R',
        lat: -40.123,
        lng: -20.678
      },
      {
        groupId: 4,
        address: '1616 Lychee Street',
        city: 'City S',
        state: 'State S',
        lat: 1.234,
        lng: -50.789
      },
      {
        groupId: 5,
        address: '1717 Passionfruit Street',
        city: 'City T',
        state: 'State T',
        lat: 2.345,
        lng: -2.890
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
    await queryInterface.bulkDelete('Venues', null, {})

  }
};
