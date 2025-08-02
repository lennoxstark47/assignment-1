'use strict';

const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const products = [];
    const productCategories = ['Electronics', 'Books', 'Home Goods', 'Apparel', 'Sports', 'Food'];
    for (let i = 0; i < 50; i++) {
      products.push({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({ min: 10, max: 1000, dec: 2 }),
        stock_quantity: faker.number.int({ min: 10, max: 500 }),
      });
    }
    await queryInterface.bulkInsert('products', products, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};