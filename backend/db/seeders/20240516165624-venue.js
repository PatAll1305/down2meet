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
    await queryInterface.bulkInsert('Venues', [
      {
        groupId: 1,
        address: '123 Main Street',
        city: 'City A',
        state: 'State A',
        lat: 123.456,
        lng: -78.901
      },
      {
        groupId: 2,
        address: '456 Elm Street',
        city: 'City B',
        state: 'State B',
        lat: 234.567,
        lng: -89.012
      },
      {
        groupId: 3,
        address: '789 Oak Street',
        city: 'City C',
        state: 'State C',
        lat: 345.678,
        lng: -90.123
      },
      {
        groupId: 4,
        address: '101 Pine Street',
        city: 'City D',
        state: 'State D',
        lat: 456.789,
        lng: -100.234
      },
      {
        groupId: 5,
        address: '202 Maple Street',
        city: 'City E',
        state: 'State E',
        lat: 567.890,
        lng: -110.345
      },
      {
        groupId: 1,
        address: '303 Cedar Street',
        city: 'City F',
        state: 'State F',
        lat: 678.901,
        lng: -120.456
      },
      {
        groupId: 2,
        address: '404 Walnut Street',
        city: 'City G',
        state: 'State G',
        lat: 789.012,
        lng: -130.567
      },
      {
        groupId: 3,
        address: '505 Birch Street',
        city: 'City H',
        state: 'State H',
        lat: 890.123,
        lng: -140.678
      },
      {
        groupId: 4,
        address: '606 Ash Street',
        city: 'City I',
        state: 'State I',
        lat: 901.234,
        lng: -150.789
      },
      {
        groupId: 5,
        address: '707 Poplar Street',
        city: 'City J',
        state: 'State J',
        lat: 912.345,
        lng: -160.890
      },
      {
        groupId: 1,
        address: '808 Pineapple Street',
        city: 'City K',
        state: 'State K',
        lat: 923.456,
        lng: -170.901
      },
      {
        groupId: 2,
        address: '909 Mango Street',
        city: 'City L',
        state: 'State L',
        lat: 934.567,
        lng: -180.012
      },
      {
        groupId: 3,
        address: '1010 Coconut Street',
        city: 'City M',
        state: 'State M',
        lat: 945.678,
        lng: -190.123
      },
      {
        groupId: 4,
        address: '1111 Banana Street',
        city: 'City N',
        state: 'State N',
        lat: 956.789,
        lng: -200.234
      },
      {
        groupId: 5,
        address: '1212 Papaya Street',
        city: 'City O',
        state: 'State O',
        lat: 967.890,
        lng: -210.345
      }, {
        groupId: 1,
        address: '1313 Guava Street',
        city: 'City P',
        state: 'State P',
        lat: 978.901,
        lng: -220.456
      },
      {
        groupId: 2,
        address: '1414 Kiwi Street',
        city: 'City Q',
        state: 'State Q',
        lat: 989.012,
        lng: -230.567
      },
      {
        groupId: 3,
        address: '1515 Dragonfruit Street',
        city: 'City R',
        state: 'State R',
        lat: 990.123,
        lng: -240.678
      },
      {
        groupId: 4,
        address: '1616 Lychee Street',
        city: 'City S',
        state: 'State S',
        lat: 991.234,
        lng: -250.789
      },
      {
        groupId: 5,
        address: '1717 Passionfruit Street',
        city: 'City T',
        state: 'State T',
        lat: 992.345,
        lng: -260.890
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
