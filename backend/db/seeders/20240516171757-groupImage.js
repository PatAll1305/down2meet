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
        url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fdepositphotos.com%2Fphotos%2Frestaurant-party.html&psig=AOvVaw2Un0uIW6DhzRmzcF0O-AjK&ust=1725034429261000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCICf9JfMmogDFQAAAAAdAAAAABAI',
        preview: true
      },
      {
        groupId: 2,
        url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pexels.com%2Fphoto%2Fgroup-of-people-with-happy-faces-7551506%2F&psig=AOvVaw2Un0uIW6DhzRmzcF0O-AjK&ust=1725034429261000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCICf9JfMmogDFQAAAAAdAAAAABAk',
        preview: false
      },
      {
        groupId: 3,
        url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.westend61.de%2Fen%2Fphoto%2FOIPF04040%2Fgroup-photo-of-happy-young-friends-with-colorful-clothing-smiling-at-camera&psig=AOvVaw2Un0uIW6DhzRmzcF0O-AjK&ust=1725034429261000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCICf9JfMmogDFQAAAAAdAAAAABAq',
        preview: true
      },
      {
        groupId: 4,
        url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.123rf.com%2Fphoto_32783607_group-of-happy-smiling-girls-friends-for-ever.html&psig=AOvVaw2Un0uIW6DhzRmzcF0O-AjK&ust=1725034429261000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCICf9JfMmogDFQAAAAAdAAAAABA_',
        preview: false
      },
      {
        groupId: 5,
        url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Ffree-photos%2Fhappy-people-diverse&psig=AOvVaw2Un0uIW6DhzRmzcF0O-AjK&ust=1725034429261000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCICf9JfMmogDFQAAAAAdAAAAABBE',
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
