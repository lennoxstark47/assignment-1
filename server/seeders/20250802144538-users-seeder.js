'use strict';

const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = [];
    for (let i = 0; i < 100; i++) {
      users.push({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        registration_date: faker.date.past({ years: 2 }).toISOString().split('T')[0],
      });
    }

    await queryInterface.bulkInsert('users', users, { ignoreDuplicates: ['email'] });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};