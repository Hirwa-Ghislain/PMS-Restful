const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const RegisterCar = require('./RegisterCar');

const Bill = sequelize.define('Bill', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    registrationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: RegisterCar,
            key: 'id'
        }
    },
    entryDateTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    exitDateTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    duration: {
        type: DataTypes.DECIMAL(10, 2), // Duration in hours
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'paid'),
        defaultValue: 'pending'
    }
});

Bill.belongsTo(RegisterCar, { foreignKey: 'registrationId', as: 'registration' });
RegisterCar.hasOne(Bill, { foreignKey: 'registrationId', as: 'bill' });

module.exports = Bill;