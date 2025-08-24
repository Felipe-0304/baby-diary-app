const { Journal } = require('../models');
const { Op } = require('sequelize');

class JournalController {
  async getAllEntries(req, res) {
    try {
      const { search, startDate, endDate, mood } = req.query;
      const userId = req.user?.id || 1;
      
      let whereClause = { userId };
      
      if (search) {
        whereClause[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { text: { [Op.like]: `%${search}%` } }
        ];
      }
      
      if (startDate && endDate) {
        whereClause.date = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }
      
      if (mood && mood !== 'Todos') {
        whereClause.mood = mood;
      }
      
      const entries = await Journal.findAll({
        where: whereClause,
        order: [['date', 'DESC']],
      });
      
      res.json(entries);
    } catch (error) {
      console.error('Error obteniendo entradas del diario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
  
  async createEntry(req, res) {
    try {
      const userId = req.user?.id || 1;
      const entryData = {
        ...req.body,
        userId,
        symptoms: Array.isArray(req.body.symptoms) ? req.body.symptoms : 
                 typeof req.body.symptoms === 'string' ? JSON.parse(req.body.symptoms || '[]') : [],
        tags: Array.isArray(req.body.tags) ? req.body.tags : 
              typeof req.body.tags === 'string' ? JSON.parse(req.body.tags || '[]') : []
      };
      
      const entry = await Journal.create(entryData);
      res.status(201).json(entry);
    } catch (error) {
      console.error('Error creando entrada del diario:', error);
      res.status(500).json({ error: 'Error creando entrada' });
    }
  }
  
  async updateEntry(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || 1;
      
      const updateData = {
        ...req.body,
        symptoms: Array.isArray(req.body.symptoms) ? req.body.symptoms : 
                 typeof req.body.symptoms === 'string' ? JSON.parse(req.body.symptoms || '[]') : [],
        tags: Array.isArray(req.body.tags) ? req.body.tags : 
              typeof req.body.tags === 'string' ? JSON.parse(req.body.tags || '[]') : []
      };
      
      const [updatedRows] = await Journal.update(updateData, {
        where: { id, userId }
      });
      
      if (updatedRows === 0) {
        return res.status(404).json({ error: 'Entrada no encontrada' });
      }
      
      const updatedEntry = await Journal.findByPk(id);
      res.json(updatedEntry);
    } catch (error) {
      console.error('Error actualizando entrada:', error);
      res.status(500).json({ error: 'Error actualizando entrada' });
    }
  }
  
  async deleteEntry(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || 1;
      
      const deletedRows = await Journal.destroy({
        where: { id, userId }
      });
      
      if (deletedRows === 0) {
        return res.status(404).json({ error: 'Entrada no encontrada' });
      }
      
      res.json({ message: 'Entrada eliminada correctamente' });
    } catch (error) {
      console.error('Error eliminando entrada:', error);
      res.status(500).json({ error: 'Error eliminando entrada' });
    }
  }

  async getStats(req, res) {
    try {
      const userId = req.user?.id || 1;
      const { sequelize } = require('../models');
      
      const totalEntries = await Journal.count({ where: { userId } });
      
      const moodStats = await Journal.findAll({
        where: { userId },
        attributes: [
          'mood',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['mood'],
        raw: true
      });

      const averageEnergy = await Journal.findAll({
        where: { userId },
        attributes: [
          [sequelize.fn('AVG', sequelize.col('energy')), 'avgEnergy']
        ],
        raw: true
      });
      
      res.json({
        totalEntries,
        moodStats,
        averageEnergy: parseFloat(averageEnergy[0].avgEnergy || 0).toFixed(1)
      });
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      res.status(500).json({ error: 'Error obteniendo estadísticas' });
    }
  }
}

module.exports = new JournalController();
