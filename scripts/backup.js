const BackupService = require('../server/utils/backup');
const path = require('path');

async function createManualBackup() {
  console.log('🔄 Creando backup manual...');
  
  try {
    const backupPath = await BackupService.createBackup();
    console.log('✅ Backup creado exitosamente:', path.basename(backupPath));
    
    // Mostrar lista de backups
    const backups = await BackupService.listBackups();
    console.log('\n📋 Backups disponibles:');
    backups.forEach((backup, index) => {
      console.log(`${index + 1}. ${backup.filename} - ${new Date(backup.timestamp.replace(/-/g, ':')).toLocaleString()}`);
    });
    
  } catch (error) {
    console.error('❌ Error creando backup:', error);
    process.exit(1);
  }
}

createManualBackup();
