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
        url: 'https://assets3.cbsnewsstatic.com/hub/i/r/2011/07/27/5d9518d7-a643-11e2-a3f0-029118418759/thumbnail/640x350/926c55f0cdb2d9c56adfc9231261dc95/800px-Anonymous_at_Scientology_in_Los_Angeles.jpg?v=29ebd300d9a3cd24077d945a46991f72',
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
        url: 'https://www.google.com/url?sa=https://cdn-apkpk.nitrocdn.com/ORTUaBxDZqklpdaXWJHCKPnkdYhRBLBZ/assets/images/optimized/rev-5620df5/www.sullivan-group.com/wp-content/uploads/2022/03/team-1.pngi&url=https%3A%2F%2Fwww.vecteezy.com%2Ffree-photos%2Fhappy-people-diverse&psig=AOvVaw2Un0uIW6DhzRmzcF0O-AjK&ust=1725034429261000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCICf9JfMmogDFQAAAAAdAAAAABBE',
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
