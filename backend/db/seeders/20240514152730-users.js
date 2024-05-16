'use strict';

/** @type {import('sequelize-cli').Migration} */
const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
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
    // Use bulkCreate to insert users into the database
    await User.bulkCreate([
      {
        firstName: 'John',
        lastName: 'Doe',
        username: 'john_doe',
        email: 'john@example.com',
        hashedPassword: bcrypt.hashSync('password123')
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        username: 'jane_smith',
        email: 'jane@example.com',
        hashedPassword: bcrypt.hashSync('testpassword')
      },
      {
        firstName: 'Bruce',
        lastName: 'Wayne',
        username: 'batman',
        email: 'batman@example.com',
        hashedPassword: bcrypt.hashSync('darkknight')
      },
      {
        firstName: 'Clark',
        lastName: 'Kent',
        username: 'superman',
        email: 'superman@example.com',
        hashedPassword: bcrypt.hashSync('kryptonite')
      },
      {
        firstName: 'Peter',
        lastName: 'Parker',
        username: 'spiderman',
        email: 'peter@example.com',
        hashedPassword: bcrypt.hashSync('webcrawler')
      },
      {
        firstName: 'Diana',
        lastName: 'Prince',
        username: 'wonderwoman',
        email: 'diana@example.com',
        hashedPassword: bcrypt.hashSync('amazonian')
      },
      {
        firstName: 'Tony',
        lastName: 'Stark',
        username: 'ironman',
        email: 'tony@example.com',
        hashedPassword: bcrypt.hashSync('geniusbillionaireplayboyphilanthropist')
      },
      {
        firstName: 'Steve',
        lastName: 'Rogers',
        username: 'captainamerica',
        email: 'steve@example.com',
        hashedPassword: bcrypt.hashSync('super-soldier')
      },
      {
        firstName: 'Bruce',
        lastName: 'Banner',
        username: 'hulk',
        email: 'bruce@example.com',
        hashedPassword: bcrypt.hashSync('smash')
      },
      {
        firstName: 'Natasha',
        lastName: 'Romanoff',
        username: 'blackwidow',
        email: 'natasha@example.com',
        hashedPassword: bcrypt.hashSync('spy')
      },
      {
        firstName: 'Logan',
        lastName: 'Howlett',
        username: 'wolverine',
        email: 'logan@example.com',
        hashedPassword: bcrypt.hashSync('adamantium')
      },
      {
        firstName: 'Barry',
        lastName: 'Allen',
        username: 'flash',
        email: 'barry@example.com',
        hashedPassword: bcrypt.hashSync('speedforce')
      },
      {
        firstName: 'Hal',
        lastName: 'Jordan',
        username: 'greenlantern',
        email: 'hal@example.com',
        hashedPassword: bcrypt.hashSync('willpower')
      },
      {
        firstName: 'Arthur',
        lastName: 'Curry',
        username: 'aquaman',
        email: 'arthur@example.com',
        hashedPassword: bcrypt.hashSync('atlantis')
      },
      {
        firstName: 'T\'Challa',
        lastName: 'son of T\'Chaka',
        username: 'blackpanther',
        email: 'tchalla@example.com',
        hashedPassword: bcrypt.hashSync('wakandaForever')
      },
      {
        firstName: 'Carol',
        lastName: 'Danvers',
        username: 'captainmarvel',
        email: 'carol@example.com',
        hashedPassword: bcrypt.hashSync('binary')
      },
      {
        firstName: 'Stephen',
        lastName: 'Strange',
        username: 'doctorstrange',
        email: 'stephen@example.com',
        hashedPassword: bcrypt.hashSync('sorcerer')
      },
      {
        firstName: 'Victor',
        lastName: 'Stone',
        username: 'cyborg',
        email: 'victor@example.com',
        hashedPassword: bcrypt.hashSync('half-human')
      },
      {
        firstName: 'Clint',
        lastName: 'Barton',
        username: 'hawkeye',
        email: 'clint@example.com',
        hashedPassword: bcrypt.hashSync('archer')
      },
      {
        firstName: 'Scott',
        lastName: 'Lang',
        username: 'antman',
        email: 'scott@example.com',
        hashedPassword: bcrypt.hashSync('shrinking')
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
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return await queryInterface.bulkDelete(options, null, {})
  }
};
