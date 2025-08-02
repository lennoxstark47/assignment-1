const sequelize = require('../db'); // Import the Sequelize instance

const db = {};


db.User = require('./User')(sequelize);
db.Product = require('./Product')(sequelize);
db.Order = require('./Order')(sequelize);
db.Transaction = require('./Transaction')(sequelize);
db.SupportTicket = require('./SupportTicket')(sequelize);

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});


db.User.hasMany(db.Order, { foreignKey: 'user_id', as: 'orders' });
db.Order.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' }); // An order belongs to one user

// Order has many Transactions (an order can have multiple payment transactions)
db.Order.hasMany(db.Transaction, { foreignKey: 'order_id', as: 'transactions' });
db.Transaction.belongsTo(db.Order, { foreignKey: 'order_id', as: 'order' }); // A transaction belongs to one order

// User has many SupportTickets (a user can open multiple support tickets)
db.User.hasMany(db.SupportTicket, { foreignKey: 'user_id', as: 'supportTickets' });
db.SupportTicket.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' }); // A support ticket belongs to one user


db.sequelize = sequelize;


module.exports = db;
