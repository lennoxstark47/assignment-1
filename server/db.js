
const { Sequelize } = require('sequelize');


const dbConfig = {
    database: 'dashboard_db',
    username: 'your_username',
    password: 'your_password',
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: false,
};


const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    define: {
        timestamps: false,
        underscored: true,
    }
});


module.exports = sequelize;
