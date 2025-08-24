const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Journal = sequelize.define('Journal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  mood: {
    type: DataTypes.ENUM('Feliz', 'Neutral', 'Triste', 'Emocionado', 'Ansioso', 'Cansado'),
    defaultValue: 'Neutral',
  },
  energy: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 10,
    },
    defaultValue: 5,
  },
  symptoms: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  gratitude: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  isPrivate: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
});

module.exports = Journal;
