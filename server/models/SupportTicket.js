
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const SupportTicket = sequelize.define('SupportTicket', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        subject: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
        status: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'Open',
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'support_tickets'
    });

    return SupportTicket;
};
