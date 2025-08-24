const { Memory } = require('../models');
const { Op } = require('sequelize');

class MemoryController {
  async getAllMemories(req, res) {
    try {
      const { category, search, startDate, endDate, favorite } = req.query;
      const userId = req.user?.id || 1;
      
      let whereClause = { userId };
      
      if (category && category !== 'Todos') {
        whereClause.category = category;
      }
      
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
      
      if (favorite === 'true') {
        whereClause.isFavorite = true;
      }
      
      const memories = await Memory.findAll({
        where: whereClause,
        order: [['date', 'DESC']],
      });
      
      res.json(memories);
    } catch (error) {
      console.error('Error obteniendo memorias:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
  
  async createMemory(req, res) {
    try {
      const userId = req.user?.id || 1;
      const memoryData = {
        ...req.body,
        userId,
        tags: Array.isArray(req.body.tags) ? req.body.tags : 
              typeof req.body.tags === 'string' ? JSON.parse(req.body.tags || '[]') : [],
        image: req.file ? `/uploads/${req.file.filename}` : null
      };
      
      const memory = await Memory.create(memoryData);
      res.status(201).json(memory);
    } catch (error) {
      console.error('Error creando memoria:', error);
      res.status(500).json({ error: 'Error creando memoria' });
    }
  }
  
  async updateMemory(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || 1;
      
      const updateData = {
        ...req.body,
        tags: Array.isArray(req.body.tags) ? req.body.tags : 
              typeof req.body.tags === 'string' ? JSON.parse(req.body.tags || '[]') : []
      };
      
      if (req.file) {
        updateData.image = `/uploads/${req.file.filename}`;
      }
      
      const [updatedRows] = await Memory.update(updateData, {
        where: { id, userId }
      });
      
      if (updatedRows === 0) {
        return res.status(404).json({ error: 'Memoria no encontrada' });
      }
      
      const updatedMemory = await Memory.findByPk(id);
      res.json(updatedMemory);
    } catch (error) {
      console.error('Error actualizando memoria:', error);
      res.status(500).json({ error: 'Error actualizando memoria' });
    }
  }
  
  async deleteMemory(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || 1;
      
      const deletedRows = await Memory.destroy({
        where: { id, userId }
      });
      
      if (deletedRows === 0) {
        return res.status(404).json({ error: 'Memoria no encontrada' });
      }
      
      res.json({ message: 'Memoria eliminada correctamente' });
    } catch (error) {
      console.error('Error eliminando memoria:', error);
      res.status(500).json({ error: 'Error eliminando memoria' });
    }
  }
  
  async getStats(req, res) {
    try {
      const userId = req.user?.id || 1;
      const { sequelize } = require('../models');
      
      const totalMemories = await Memory.count({ where: { userId } });
      const memoriesWithPhotos = await Memory.count({ 
        where: { 
          userId, 
          image: { [Op.not]: null } 
        } 
      });
      const favoriteMemories = await Memory.count({ 
        where: { userId, isFavorite: true } 
      });
      
      const categoriesStats = await Memory.findAll({
        where: { userId },
        attributes: [
          'category',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['category'],
        raw: true
      });
      
      res.json({
        totalMemories,
        memoriesWithPhotos,
        favoriteMemories,
        categoriesStats
      });
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      res.status(500).json({ error: 'Error obteniendo estadísticas' });
    }
  }
}

module.exports = new MemoryController();
