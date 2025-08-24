const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

async function setup() {
  console.log('🚀 Configurando Baby Diary App...\n');
  
  try {
    // 1. Crear archivo .env del servidor si no existe
    const envPath = path.join(__dirname, '../server/.env');
    try {
      await fs.access(envPath);
      console.log('✅ Archivo .env del servidor ya existe');
    } catch {
      const envContent = `NODE_ENV=development
PORT=5000
JWT_SECRET=${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}
CORS_ORIGIN=http://localhost:3000
UPLOAD_PATH=./uploads
BACKUP_PATH=./backups
MAX_FILE_SIZE=52428800
DATABASE_URL=../database/baby_diary.db`;
      
      await fs.writeFile(envPath, envContent);
      console.log('✅ Archivo .env del servidor creado');
    }

    // 2. Crear archivo .env del cliente si no existe
    const clientEnvPath = path.join(__dirname, '../client/.env');
    try {
      await fs.access(clientEnvPath);
      console.log('✅ Archivo .env del cliente ya existe');
    } catch {
      const clientEnvContent = `REACT_APP_API_URL=http://localhost:5000/api
GENERATE_SOURCEMAP=false`;
      
      await fs.writeFile(clientEnvPath, clientEnvContent);
      console.log('✅ Archivo .env del cliente creado');
    }
    
    // 3. Instalar dependencias del servidor
    console.log('\n📦 Instalando dependencias del servidor...');
    await execPromise('cd server && npm install');
    console.log('✅ Dependencias del servidor instaladas');
    
    // 4. Instalar dependencias del cliente
    console.log('\n📦 Instalando dependencias del cliente...');
    await execPromise('cd client && npm install');
    console.log('✅ Dependencias del cliente instaladas');
    
    // 5. Crear directorios necesarios
    const directories = [
      'server/uploads',
      'server/uploads/images',
      'server/uploads/videos',
      'server/backups',
      'database'
    ];
    
    for (const dir of directories) {
      const dirPath = path.join(__dirname, '..', dir);
      await fs.mkdir(dirPath, { recursive: true });
      console.log(`✅ Directorio ${dir} creado`);
    }
    
    console.log('\n🎉 ¡Configuración completada exitosamente!');
    console.log('\n📋 Próximos pasos:');
    console.log('1. cd baby-diary-app');
    console.log('2. npm run dev');
    console.log('\n🌐 La aplicación estará disponible en:');
    console.log('- Frontend: http://localhost:3000');
    console.log('- Backend: http://localhost:5000');
    console.log('- API Health: http://localhost:5000/api/health');
    console.log('\n📖 Funcionalidades disponibles:');
    console.log('- ✅ Sistema completo de memorias con fotos/videos');
    console.log('- ✅ Diario personal con estados de ánimo');
    console.log('- ✅ Lista de tareas con categorías');
    console.log('- ✅ Calendario de eventos y citas');
    console.log('- ✅ Registros médicos y seguimiento');
    console.log('- ✅ Galería de fotos organizada');
    console.log('- ✅ Navegación responsive (móvil y desktop)');
    console.log('- ✅ Sistema de backups automáticos');
    
  } catch (error) {
    console.error('❌ Error durante la configuración:', error);
    process.exit(1);
  }
}

setup();
