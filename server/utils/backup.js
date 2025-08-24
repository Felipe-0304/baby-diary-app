const fs = require('fs').promises;
const path = require('path');
const archiver = require('archiver');
const { User, Memory, Journal, Task, Appointment, MedicalRecord } = require('../models');

class BackupService {
  constructor() {
    this.backupPath = path.join(__dirname, '../backups');
  }

  async createBackup() {
    try {
      await fs.mkdir(this.backupPath, { recursive: true });

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFilename = `backup-${timestamp}.zip`;
      const backupFullPath = path.join(this.backupPath, backupFilename);

      const users = await User.findAll();
      const memories = await Memory.findAll();
      const journals = await Journal.findAll();
      const tasks = await Task.findAll();
      const appointments = await Appointment.findAll();
      const medicalRecords = await MedicalRecord.findAll();

      const backupData = {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        data: {
          users,
          memories,
          journals,
          tasks,
          appointments,
          medicalRecords
        }
      };

      const output = require('fs').createWriteStream(backupFullPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      return new Promise((resolve, reject) => {
        output.on('close', () => {
          console.log(`Backup creado: ${backupFilename} (${archive.pointer()} bytes)`);
          resolve(backupFullPath);
        });

        archive.on('error', reject);
        archive.pipe(output);

        archive.append(JSON.stringify(backupData, null, 2), { name: 'data.json' });

        const uploadsPath = path.join(__dirname, '../uploads');
        try {
          archive.directory(uploadsPath, 'uploads');
        } catch (error) {
          console.log('No se encontró directorio de uploads');
        }

        archive.finalize();
      });

    } catch (error) {
      console.error('Error creando backup:', error);
      throw error;
    }
  }

  async listBackups() {
    try {
      const files = await fs.readdir(this.backupPath);
      const backups = files
        .filter(file => file.startsWith('backup-') && file.endsWith('.zip'))
        .map(file => {
          const fullPath = path.join(this.backupPath, file);
          return {
            filename: file,
            path: fullPath,
            timestamp: file.replace('backup-', '').replace('.zip', '').replace(/-/g, ':')
          };
        })
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      return backups;
    } catch (error) {
      console.error('Error listando backups:', error);
      return [];
    }
  }

  async deleteOldBackups(keepCount = 10) {
    try {
      const backups = await this.listBackups();
      
      if (backups.length <= keepCount) {
        return;
      }

      const backupsToDelete = backups.slice(keepCount);
      
      for (const backup of backupsToDelete) {
        await fs.unlink(backup.path);
        console.log(`Backup antiguo eliminado: ${backup.filename}`);
      }

    } catch (error) {
      console.error('Error eliminando backups antiguos:', error);
    }
  }
}

module.exports = new BackupService();
