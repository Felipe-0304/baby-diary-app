const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('General', 'Compras', 'Preparativos', 'Médico', 'Decisiones', 'Educación'),
    defaultValue: 'General',
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  priority: {
    type: DataTypes.ENUM('Baja', 'Media', 'Alta'),
    defaultValue: 'Media',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  estimatedCost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  completedDate: {
    type: DataTypes.DATE,
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

module.exports = Task;
