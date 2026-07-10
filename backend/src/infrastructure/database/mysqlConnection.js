const mysql = require('mysql2/promise');
require('dotenv').config();

class MySQLConnection {
  constructor() {
    this.pool = null;
  }

  async connect() {
    try {
      this.pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'marketplace_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
      });

      const connection = await this.pool.getConnection();
      console.log('✅ Connecté à MySQL');
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