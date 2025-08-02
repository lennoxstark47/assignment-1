'use strict';

const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Fetch existing order IDs to link transactions
    const existingOrders = await queryInterface.sequelize.query(
        'SELECT id FROM orders;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const orderIds = existingOrders.map(order => order.id);

    if (orderIds.length === 0) {
      console.warn('No orders found to create transactions. Please run orders-seeder first.');
      return;
    }

    const transactions = [];
    const paymentMethods = ['Credit Card', 'PayPal', 'Bank Transfer', 'Crypto'];
    for (let i = 0; i < 300; i++) { // Generate 300 transactions
      transactions.push({
        order_id: orderIds[faker.number.int({ min: 0, max: orderIds.length - 1 })], // Random order ID
        transaction_date: faker.date.recent({ days: 25 }), // Transactions in the last 25 days
        amount: faker.commerce.price({ min: 10, max: 400, dec: 2 }),
        payment_method: paymentMethods[faker.number.int({ min: 0, max: paymentMethods.length - 1 })],
      });
    }
    await queryInterface.bulkInsert('transactions', transactions, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('transactions', null, {});
  }
};