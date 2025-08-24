const { MedicalRecord } = require('../models');
const { Op } = require('sequelize');

class MedicalController {
  async getAllRecords(req, res) {
    try {
      const { type, startDate, endDate } = req.query;
      const userId = req.user?.id || 1;
      
      let whereClause = { userId };
      
      if (type && type !== 'Todos') {
        whereClause.type = type;
      }
      
      if (startDate && endDate) {
        whereClause.date = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }
      
      const records = await MedicalRecord.findAll({
        where: whereClause,
        order: [['date', 'DESC']],
      });
      
      res.json(records);
    } catch (error) {
      console.error('Error obteniendo registros médicos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
  
  async createRecord(req, res) {
    try {
      const userId = req.user?.id || 1;
      const recordData = {
        ...req.body,
        userId
      };
      
      const record = await MedicalRecord.create(recordData);
      res.status(201).json(record);
    } catch (error) {
      console.error('Error creando registro médico:', error);
      res.status(500).json({ error: 'Error creando registro' });
    }
  }
  
  async updateRecord(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || 1;
      
      const [updatedRows] = await MedicalRecord.update(req.body, {
        where: { id, userId }
      });
      
      if (updatedRows === 0) {
        return res.status(404).json({ error: 'Registro no encontrado' });
      }
      
      const updatedRecord = await MedicalRecord.findByPk(id);
      res.json(updatedRecord);
    } catch (error) {
      console.error('Error actualizando registro:', error);
      res.status(500).json({ error: 'Error actualizando registro' });
    }
  }
  
  async deleteRecord(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || 1;
      
      const deletedRows = await MedicalRecord.destroy({
        where: { id, userId }
      });
      
      if (deletedRows === 0) {
        return res.status(404).json({ error: 'Registro no encontrado' });
      }
      
      res.json({ message: 'Registro eliminado correctamente' });
    } catch (error) {
      console.error('Error eliminando registro:', error);
      res.status(500).json({ error: 'Error eliminando registro' });
    }
  }

  async getByType(req, res) {
    try {
      const { type } = req.params;
      const userId = req.user?.id || 1;
      
      const records = await MedicalRecord.findAll({
        where: { userId, type },
        order: [['date', 'ASC']],
      });
      
      res.json(records);
    } catch (error) {
      console.error('Error obteniendo registros por tipo:', error);
      res.status(500).json({ error: 'Error obteniendo registros' });
    }
  }
}

module.exports = new MedicalController();
