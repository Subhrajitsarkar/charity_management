// models/donationModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Donation = sequelize.define('donation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    orderId: { type: DataTypes.STRING },
    paymentId: { type: DataTypes.STRING },
    paymentStatus: {
        type: DataTypes.STRING,
        defaultValue: 'PENDING'
    }
});

module.exports = Donation;
