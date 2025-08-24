const sequelize = require('../config/database');
const User = require('./User');
const Memory = require('./Memory');
const Journal = require('./Journal');
const Task = require('./Task');
const Appointment = require('./Appointment');
const MedicalRecord = require('./MedicalRecord');

// Definir asociaciones
User.hasMany(Memory, { foreignKey: 'userId', as: 'memories' });
Memory.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Journal, { foreignKey: 'userId', as: 'journals' });
Journal.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Task, { foreignKey: 'userId', as: 'tasks' });
Task.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Appointment, { foreignKey: 'userId', as: 'appointments' });
Appointment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(MedicalRecord, { foreignKey: 'userId', as: 'medicalRecords' });
MedicalRecord.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Memory,
  Journal,
  Task,
  Appointment,
  MedicalRecord
};
