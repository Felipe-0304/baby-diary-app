const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Memory = sequelize.define('Memory', {
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
  category: {
    type: DataTypes.ENUM('Hitos', 'Fotos', 'Videos', 'Médico', 'Emocional', 'Síntomas'),
    allowNull: false,
  },
  mood: {
    type: DataTypes.ENUM('Feliz', 'Neutral', 'Triste', 'Emocionado', 'Ansioso'),
    defaultValue: 'Neutral',
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  video: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  media_type: {
    type: DataTypes.ENUM('image', 'video', 'both', 'none'),
    defaultValue: 'none',
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  isFavorite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  weather: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
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

module.exports = Memory;
