require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  uploadPath: process.env.UPLOAD_PATH || './uploads',
  backupPath: process.env.BACKUP_PATH || './backups',
  maxFileSize: process.env.MAX_FILE_SIZE || 50 * 1024 * 1024,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  database: {
    dialect: 'sqlite',
    storage: process.env.DATABASE_URL || './database/baby_diary.db'
  }
};
