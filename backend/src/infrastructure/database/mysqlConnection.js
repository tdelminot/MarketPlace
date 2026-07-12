const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

class MySQLConnection {
  constructor() {
    this.pool = null;
  }

  async connect() {
    try {
      console.log('🔌 Tentative de connexion à MySQL Clever Cloud...');
      console.log(`📡 Host: ${process.env.DB_HOST}`);
      console.log(`🔢 Port: ${process.env.DB_PORT}`);
      console.log(`📚 Database: ${process.env.DB_NAME}`);
      console.log(`👤 User: ${process.env.DB_USER}`);

      this.pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
        connectTimeout: 30000
      });

      const connection = await this.pool.getConnection();
      console.log('✅ Connecté à MySQL Clever Cloud avec succès !');
      console.log(`📊 Version MySQL: ${connection.serverVersion || '8.0'}`);
      connection.release();
      
      return this.pool;
    } catch (error) {
      console.error('❌ Erreur de connexion MySQL:', error.message);
      throw error;
    }
  }

  getPool() {
    if (!this.pool) {
      throw new Error('Base de données non connectée');
    }
    return this.pool;
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      console.log('MySQL déconnecté');
    }
  }
}

module.exports = new MySQLConnection();