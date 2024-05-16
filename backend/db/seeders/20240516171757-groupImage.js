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
    await queryInterface.bulkInsert('GroupImages', [
      {
        groupId: 1,
        url: 'https://example.com/group1_image1.jpg',
        preview: true
      },
      {
        groupId: 1,
        url: 'https://example.com/group1_image2.jpg',
        preview: false
      },
      {
        groupId: 2,
        url: 'https://example.com/group2_image1.jpg',
        preview: true
      },
      {
        groupId: 2,
        url: 'https://example.com/group2_image2.jpg',
        preview: false
      },
      {
        groupId: 3,
        url: 'https://example.com/group3_image1.jpg',
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
    await queryInterface.bulkDelete('GroupImages', null, {})

  }
};
