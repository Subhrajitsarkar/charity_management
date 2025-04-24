// models/charityModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Charity = sequelize.define('charity', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mission: { type: DataTypes.TEXT },
    location: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING },
    isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    impactReport: { type: DataTypes.TEXT }
});

module.exports = Charity;
