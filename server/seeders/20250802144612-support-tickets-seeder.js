'use strict';

const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Fetch existing user IDs to link support tickets
    const existingUsers = await queryInterface.sequelize.query(
        'SELECT id FROM users;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const userIds = existingUsers.map(user => user.id);

    if (userIds.length === 0) {
      console.warn('No users found to create support tickets. Please run users-seeder first.');
      return;
    }

    const supportTickets = [];
    const statuses = ['Open', 'Closed', 'In Progress', 'Resolved'];
    for (let i = 0; i < 150; i++) { // Generate 150 support tickets
      supportTickets.push({
        user_id: userIds[faker.number.int({ min: 0, max: userIds.length - 1 })], // Random user ID
        subject: faker.lorem.sentence({ min: 5, max: 10 }), // 5-10 word subject
        description: faker.lorem.paragraph({ min: 2, max: 5 }), // 2-5 sentence description
        status: statuses[faker.number.int({ min: 0, max: statuses.length - 1 })],
        created_at: faker.date.recent({ days: 60 }), // Tickets in the last 60 days
      });
    }
    await queryInterface.bulkInsert('support_tickets', supportTickets, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('support_tickets', null, {});
  }
};