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
        url: 'https://www.eventgroup.ca/wp-content/uploads/2019/06/logo2.png',
        preview: true
      },
      {
        eventId: 2,
        url: 'https://ocdn.eu/pulscms-transforms/1/tlik9kuTURBXy9kYTYyMzk4OC1hMjlhLTQ3MTEtODU1Mi0yMTc1ZDA3MzJiNzYuanBlZ5GVAs0CZwDDw94AAaEwAQ',
        preview: true
      },
      {
        eventId: 3,
        url: 'https://s3-media0.fl.yelpcdn.com/bphoto/-RswpbtUMjiuCRMYaOGkXA/o.jpg',
        preview: true
      },
      {
        eventId: 4,
        url: 'https://s3-media0.fl.yelpcdn.com/bphoto/Ow8X0yaS93Lt_tEQqV_sMA/348s.jpg',
        preview: true
      },
      {
        eventId: 5,
        url: 'https://www.ronnyleber.com/wp-content/uploads/2021/03/team-building-1-1024x683.jpg',
        preview: true
      },
      {
        eventId: 6,
        url: 'https://www.ronnyleber.com/wp-content/uploads/2021/03/team-building-title.jpeg',
        preview: true
      },
      {
        eventId: 7,
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdOPaS09NQGfsZjcnLH8tI6rFzbxLoqMszrZDNMY0a6QO9xI5YraTGEHiikJGtV3jTRfw&usqp=CAU',
        preview: true
      },
      {
        eventId: 8,
        url: 'https://keystoneshootingcenter.com/content/uploads/2019/12/02-unique-team-building-events-1.png',
        preview: true
      },
      {
        eventId: 9,
        url: 'https://www.outbackteambuilding.com/wp-content/uploads/2023/09/The-Top-69-Indoor-Team-Building-Activities-featured-image.png',
        preview: true
      },
      {
        eventId: 10,
        url: 'https://www.invitejapan.com/wp-content/uploads/2024/02/indoor-team-building-activities.jpg',
        preview: true
      },
      {
        eventId: 11,
        url: 'https://prod.gusto-assets.com/media/35-Team-Building-Activities.jpg',
        preview: true
      },
      {
        eventId: 12,
        url: 'https://images.jpost.com/image/upload/q_auto/c_fill,g_faces:center,h_537,w_822/390855',
        preview: true
      },
      {
        eventId: 13,
        url: 'https://puttingworld.com/wp-content/uploads/2023/10/58bfc5eb-8d1c-46c3-9c50-17b10dd157a5-1024x703.jpg',
        preview: true
      },
      {
        eventId: 14,
        url: 'https://resizing.flixster.com/U1lRt24YK7At-1kp4K_6JezRgiU=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzllNmU0N2Y3LWI1NzUtNDQzZS1iZGQyLTU3OTlmNjFkMTEzOS5qcGc=',
        preview: true
      },
      {
        eventId: 15,
        url: 'https://media.cnn.com/api/v1/images/stellar/prod/220415114717-01-banned-book-clubs.jpg?c=16x9&q=h_833,w_1480,c_fill',
        preview: true
      },
      {
        eventId: 16,
        url: 'https://i0.wp.com/warzone.hk/wp-content/uploads/2021/07/war-zone-custom-experience-team-building-1920x1080-1.jpg?fit=756%2C425&ssl=1',
        preview: true
      },
      {
        eventId: 17,
        url: 'https://www.bleepstatic.com/content/hl-images/2021/12/28/hacker.jpg?rand=1097621381',
        preview: true
      },
      {
        eventId: 18,
        url: 'https://www.yourtango.com/sites/default/files/image_blog/adult-sleepover-ideas.jpg',
        preview: true
      },
      {
        eventId: 19,
        url: 'https://batterdreams.com/wp-content/uploads/2024/05/funny-adult-women-having-slumber-party-1-scaled.jpg',
        preview: true
      },
      {
        eventId: 20,
        url: 'https://s3-media0.fl.yelpcdn.com/bphoto/k6S4ssFGN2YZiN2E43aiXw/o.jpg',
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
