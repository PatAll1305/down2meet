'use strict';
const { GroupImage } = require('../models')

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
    await GroupImage.bulkCreate([
      {
        groupId: 1,
        url: 'https://st4.depositphotos.com/2931363/20161/i/380/depositphotos_201618554-stock-photo-friends-smiling-while-taking-pizza.jpg',
        preview: true
      },
      {
        groupId: 2,
        url: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Anonymous_emblem.svg',
        preview: false
      },
      {
        groupId: 3,
        url: 'https://st2.depositphotos.com/3591429/11568/i/380/depositphotos_115685284-stock-photo-people-interacting-with-each-other.jpg',
        preview: true
      },
      {
        groupId: 4,
        url: 'https://previews.123rf.com/images/mandygodbehear/mandygodbehear1410/mandygodbehear141000031/32783607-group-of-happy-smiling-girls-friends-for-ever.jpg',
        preview: false
      },
      {
        groupId: 5,
        url: 'https://static01.nyt.com/images/2018/05/08/well/physed-happiness/physed-happiness-superJumbo.jpg',
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
