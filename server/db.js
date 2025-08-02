
const { Sequelize } = require('sequelize');


const dbConfig = {
    database: 'dashboard_db',
    username: 'postgres',
    password: '4747',
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
