const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  babyName: {
    type: DataTypes.STRING,
    defaultValue: 'Mi Bebé',
  },
  gender: {
    type: DataTypes.ENUM('Sorpresa', 'Niño', 'Niña'),
    defaultValue: 'Sorpresa',
  },
  conceptionDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  doctorName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  hospital: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  partnerName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bloodType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  allergies: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  settings: {
    type: DataTypes.JSON,
    defaultValue: {
      themeColor: '#f472b6',
      notifications: true,
      language: 'es',
      darkMode: false
    },
  },
});

module.exports = User;
