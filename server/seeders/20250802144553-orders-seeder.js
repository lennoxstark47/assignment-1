'use strict';

const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Fetch existing user IDs to link orders
    const existingUsers = await queryInterface.sequelize.query(
        'SELECT id FROM users;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const userIds = existingUsers.map(user => user.id);

    if (userIds.length === 0) {
      console.warn('No users found to create orders. Please run users-seeder first.');
      return;
    }

    const orders = [];
    const statuses = ['Pending', 'Completed', 'Shipped', 'Cancelled'];
    for (let i = 0; i < 200; i++) {
      orders.push({
        user_id: userIds[faker.number.int({ min: 0, max: userIds.length - 1 })],
        order_date: faker.date.recent({ days: 30 }),
        total_amount: faker.commerce.price({ min: 20, max: 500, dec: 2 }),
        status: statuses[faker.number.int({ min: 0, max: statuses.length - 1 })],
      });
    }
    await queryInterface.bulkInsert('orders', orders, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('orders', null, {});
  }
};