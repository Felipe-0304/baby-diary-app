const { Task } = require('../models');
const { Op } = require('sequelize');

class TaskController {
  async getAllTasks(req, res) {
    try {
      const { category, completed, priority, search } = req.query;
      const userId = req.user?.id || 1;
      
      let whereClause = { userId };
      
      if (category && category !== 'Todos') {
        whereClause.category = category;
      }
      
      if (completed !== undefined) {
        whereClause.completed = completed === 'true';
      }
      
      if (priority && priority !== 'Todas') {
        whereClause.priority = priority;
      }
      
      if (search) {
        whereClause[Op.or] = [
          { text: { [Op.like]: `%${search}%` } },
          { notes: { [Op.like]: `%${search}%` } }
        ];
      }
      
      const tasks = await Task.findAll({
        where: whereClause,
        order: [
          ['completed', 'ASC'],
          ['priority', 'DESC'],
          ['dueDate', 'ASC']
        ],
      });
      
      res.json(tasks);
    } catch (error) {
      console.error('Error obteniendo tareas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
  
  async createTask(req, res) {
    try {
      const userId = req.user?.id || 1;
      const taskData = {
        ...req.body,
        userId
      };
      
      const task = await Task.create(taskData);
      res.status(201).json(task);
    } catch (error) {
      console.error('Error creando tarea:', error);
      res.status(500).json({ error: 'Error creando tarea' });
    }
  }
  
  async updateTask(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || 1;
      
      const updateData = { ...req.body };
      
      if (updateData.completed === true && req.body.completed !== true) {
        updateData.completedDate = new Date();
      } else if (updateData.completed === false) {
        updateData.completedDate = null;
      }
      
      const [updatedRows] = await Task.update(updateData, {
        where: { id, userId }
      });
      
      if (updatedRows === 0) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
      }
      
      const updatedTask = await Task.findByPk(id);
      res.json(updatedTask);
    } catch (error) {
      console.error('Error actualizando tarea:', error);
      res.status(500).json({ error: 'Error actualizando tarea' });
    }
  }
  
  async deleteTask(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || 1;
      
      const deletedRows = await Task.destroy({
        where: { id, userId }
      });
      
      if (deletedRows === 0) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
      }
      
      res.json({ message: 'Tarea eliminada correctamente' });
    } catch (error) {
      console.error('Error eliminando tarea:', error);
      res.status(500).json({ error: 'Error eliminando tarea' });
    }
  }

  async getStats(req, res) {
    try {
      const userId = req.user?.id || 1;
      const { sequelize } = require('../models');
      
      const totalTasks = await Task.count({ where: { userId } });
      const completedTasks = await Task.count({ where: { userId, completed: true } });
      const pendingTasks = totalTasks - completedTasks;
      
      const categoryStats = await Task.findAll({
        where: { userId },
        attributes: [
          'category',
          [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
          [sequelize.fn('SUM', sequelize.literal('CASE WHEN completed = 1 THEN 1 ELSE 0 END')), 'completed']
        ],
        group: ['category'],
        raw: true
      });

      const totalCost = await Task.findAll({
        where: { userId },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('estimated_cost')), 'totalCost']
        ],
        raw: true
      });
      
      res.json({
        totalTasks,
        completedTasks,
        pendingTasks,
        categoryStats,
        totalEstimatedCost: parseFloat(totalCost[0].totalCost || 0)
      });
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      res.status(500).json({ error: 'Error obteniendo estadísticas' });
    }
  }
}

module.exports = new TaskController();
