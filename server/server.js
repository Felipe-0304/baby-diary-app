const app = require('./app');
const { sequelize } = require('./models');
const config = require('./config/config');
const cron = require('node-cron');
const path = require('path');
const fs = require('fs').promises;

async function createDirectories() {
  const dirs = ['uploads', 'backups'];
  
  for (const dir of dirs) {
    try {
      await fs.mkdir(path.join(__dirname, dir), { recursive: true });
      console.log(`✅ Directorio ${dir} creado o verificado`);
    } catch (error) {
      console.error(`❌ Error creando directorio ${dir}:`, error);
    }
  }

  try {
    await fs.mkdir(path.join(__dirname, '../database'), { recursive: true });
    console.log('✅ Directorio database creado o verificado');
  } catch (error) {
    console.error('❌ Error creando directorio database:', error);
  }
}

function setupAutomaticBackup() {
  cron.schedule('0 2 * * *', async () => {
    console.log('🔄 Iniciando backup automático...');
    try {
      const backupService = require('./utils/backup');
      await backupService.createBackup();
      await backupService.deleteOldBackups(10);
      console.log('✅ Backup automático completado');
    } catch (error) {
      console.error('❌ Error en backup automático:', error);
    }
  });
}

async function createDefaultUser() {
  try {
    const { User } = require('./models');
    const userCount = await User.count();
    
    if (userCount === 0) {
      await User.create({
        name: 'Usuario Principal',
        dueDate: new Date(Date.now() + (6 * 30 * 24 * 60 * 60 * 1000)),
        babyName: 'Mi Bebé',
        gender: 'Sorpresa',
        settings: {
          themeColor: '#f472b6',
          notifications: true,
          language: 'es',
          darkMode: false
        }
      });
      console.log('✅ Usuario por defecto creado');
    }
  } catch (error) {
    console.error('❌ Error creando usuario por defecto:', error);
  }
}

async function startServer() {
  try {
    console.log('🚀 Iniciando Baby Diary Server...\n');
    
    await createDirectories();
    
    await sequelize.sync({ 
      alter: process.env.NODE_ENV === 'development'
    });
    console.log('✅ Base de datos sincronizada correctamente');
    
    await createDefaultUser();
    
    setupAutomaticBackup();
    console.log('✅ Backup automático configurado (diario a las 2:00 AM)');
    
    const PORT = config.port;
    app.listen(PORT, () => {
      console.log('\n🎉 ¡Servidor iniciado correctamente!');
      console.log(`🌐 Servidor corriendo en: http://localhost:${PORT}`);
      console.log(`🗄️  API disponible en: http://localhost:${PORT}/api`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🎯 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
    
  } catch (error) {
    console.error('❌ Error iniciando el servidor:', error);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  console.log('\n🔄 Cerrando servidor...');
  try {
    await sequelize.close();
    console.log('✅ Conexión a base de datos cerrada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error cerrando conexión:', error);
    process.exit(1);
  }
});

startServer();
