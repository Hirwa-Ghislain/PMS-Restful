const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Parking = require('./Parking');

const RegisterCar = sequelize.define('RegisterCar', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    plateNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parkingCode: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Parking,
            key: 'code'
        }
    },
    entryDateTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    exitDateTime: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    },
    chargedAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM('ingoing', 'outgoing'),
        defaultValue: 'ingoing'
    },
    ticketStatus: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    slot: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

// Associations
RegisterCar.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(RegisterCar, { foreignKey: 'userId', as: 'registrations' });

RegisterCar.belongsTo(Parking, { foreignKey: 'parkingCode', targetKey: 'code', as: 'parking' });
Parking.hasMany(RegisterCar, { foreignKey: 'parkingCode', sourceKey: 'code', as: 'registrations' });

module.exports = RegisterCar; 