const { Appointment } = require('../models');
const { Op } = require('sequelize');

class AppointmentController {
  async getAllAppointments(req, res) {
    try {
      const { type, completed, startDate, endDate } = req.query;
      const userId = req.user?.id || 1;
      
      let whereClause = { userId };
      
      if (type && type !== 'Todos') {
        whereClause.type = type;
      }
      
      if (completed !== undefined) {
        whereClause.completed = completed === 'true';
      }
      
      if (startDate && endDate) {
        whereClause.date = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }
      
      const appointments = await Appointment.findAll({
        where: whereClause,
        order: [['date', 'ASC']],
      });
      
      res.json(appointments);
    } catch (error) {
      console.error('Error obteniendo citas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
  
  async createAppointment(req, res) {
    try {
      const userId = req.user?.id || 1;
      const appointmentData = {
        ...req.body,
        userId
      };
      
      const appointment = await Appointment.create(appointmentData);
      res.status(201).json(appointment);
    } catch (error) {
      console.error('Error creando cita:', error);
      res.status(500).json({ error: 'Error creando cita' });
    }
  }
  
  async updateAppointment(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || 1;
      
      const [updatedRows] = await Appointment.update(req.body, {
        where: { id, userId }
      });
      
      if (updatedRows === 0) {
        return res.status(404).json({ error: 'Cita no encontrada' });
      }
      
      const updatedAppointment = await Appointment.findByPk(id);
      res.json(updatedAppointment);
    } catch (error) {
      console.error('Error actualizando cita:', error);
      res.status(500).json({ error: 'Error actualizando cita' });
    }
  }
  
  async deleteAppointment(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || 1;
      
      const deletedRows = await Appointment.destroy({
        where: { id, userId }
      });
      
      if (deletedRows === 0) {
        return res.status(404).json({ error: 'Cita no encontrada' });
      }
      
      res.json({ message: 'Cita eliminada correctamente' });
    } catch (error) {
      console.error('Error eliminando cita:', error);
      res.status(500).json({ error: 'Error eliminando cita' });
    }
  }

  async getUpcoming(req, res) {
    try {
      const userId = req.user?.id || 1;
      const now = new Date();
      
      const upcomingAppointments = await Appointment.findAll({
        where: {
          userId,
          date: { [Op.gte]: now },
          completed: false
        },
        order: [['date', 'ASC']],
        limit: 5
      });
      
      res.json(upcomingAppointments);
    } catch (error) {
      console.error('Error obteniendo próximas citas:', error);
      res.status(500).json({ error: 'Error obteniendo próximas citas' });
    }
  }
}

module.exports = new AppointmentController();
