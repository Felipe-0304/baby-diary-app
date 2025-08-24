const { User } = require('../models');

class SettingsController {
  async getProfile(req, res) {
    try {
      const userId = req.user?.id || 1;
      
      const user = await User.findByPk(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      res.json(user);
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
  
  async updateProfile(req, res) {
    try {
      const userId = req.user?.id || 1;
      
      const [updatedRows] = await User.update(req.body, {
        where: { id: userId }
      });
      
      if (updatedRows === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      const updatedUser = await User.findByPk(userId);
      res.json(updatedUser);
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      res.status(500).json({ error: 'Error actualizando perfil' });
    }
  }

  async updateSettings(req, res) {
    try {
      const userId = req.user?.id || 1;
      
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const currentSettings = user.settings || {};
      const newSettings = { ...currentSettings, ...req.body };

      await User.update({ settings: newSettings }, {
        where: { id: userId }
      });

      const updatedUser = await User.findByPk(userId);
      res.json(updatedUser.settings);
    } catch (error) {
      console.error('Error actualizando configuraciones:', error);
      res.status(500).json({ error: 'Error actualizando configuraciones' });
    }
  }
}

module.exports = new SettingsController();
