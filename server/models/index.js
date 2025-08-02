const sequelize = require("../db");
const db = {};
db.User = require("./User")(sequelize);
db.Product = require("./Product")(sequelize);
db.Order = require("./Order")(sequelize);
db.Transaction = require("./Transaction")(sequelize);
db.SupportTicket = require("./SupportTicket")(sequelize);
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
db.User.hasMany(db.Order, { foreignKey: "user_id", as: "orders" });
db.Order.belongsTo(db.User, { foreignKey: "user_id", as: "user" });
db.Order.hasMany(db.Transaction, {
  foreignKey: "order_id",
  as: "transactions",
});
db.Transaction.belongsTo(db.Order, { foreignKey: "order_id", as: "order" });
db.User.hasMany(db.SupportTicket, {
  foreignKey: "user_id",
  as: "supportTickets",
});
db.SupportTicket.belongsTo(db.User, { foreignKey: "user_id", as: "user" });
db.sequelize = sequelize;
module.exports = db;
