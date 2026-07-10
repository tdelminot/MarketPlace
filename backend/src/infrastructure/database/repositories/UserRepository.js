const IUserRepository = require('../../../domain/repositories/IUserRepository');
const User = require('../../../domain/entities/User');

class UserRepository extends IUserRepository {
  constructor(dbConnection) {
    super();
    this.db = dbConnection;
  }

  async save(user) {
    const query = `
      INSERT INTO users (id, email, password, name, role, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      email = VALUES(email),
      password = VALUES(password),
      name = VALUES(name),
      role = VALUES(role)
    `;
    
    const values = [
      user.id,
      user.email,
      user.password,
      user.fullName || user.name,
      user.role || 'user',
      user.createdAt || new Date()
    ];

    try {
      await this.db.getPool().execute(query, values);
      return user;
    } catch (error) {
      throw new Error(`Erreur sauvegarde utilisateur: ${error.message}`);
    }
  }

  async findById(id) {
    const query = 'SELECT * FROM users WHERE id = ?';
    try {
      const [rows] = await this.db.getPool().execute(query, [id]);
      if (rows.length === 0) return null;
      const row = rows[0];
      return {
        id: row.id,
        email: row.email,
        password: row.password,
        fullName: row.name,
        name: row.name,
        role: row.role || 'user',
        isSeller: row.role === 'seller',
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    } catch (error) {
      throw new Error(`Erreur recherche utilisateur: ${error.message}`);
    }
  }

  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    try {
      const [rows] = await this.db.getPool().execute(query, [email]);
      if (rows.length === 0) return null;
      const row = rows[0];
      return {
        id: row.id,
        email: row.email,
        password: row.password,
        fullName: row.name,
        name: row.name,
        role: row.role || 'user',
        isSeller: row.role === 'seller',
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    } catch (error) {
      throw new Error(`Erreur recherche utilisateur: ${error.message}`);
    }
  }

  async findByUsername(username) {
    // Recherche par email car il n'y a pas de colonne username
    const query = 'SELECT * FROM users WHERE email = ?';
    try {
      const [rows] = await this.db.getPool().execute(query, [username]);
      if (rows.length === 0) return null;
      const row = rows[0];
      return {
        id: row.id,
        email: row.email,
        password: row.password,
        fullName: row.name,
        name: row.name,
        role: row.role || 'user',
        isSeller: row.role === 'seller',
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    } catch (error) {
      throw new Error(`Erreur recherche utilisateur: ${error.message}`);
    }
  }

  async findAll() {
    const query = 'SELECT * FROM users ORDER BY created_at DESC';
    try {
      const [rows] = await this.db.getPool().execute(query);
      return rows.map(row => ({
        id: row.id,
        email: row.email,
        password: row.password,
        fullName: row.name,
        name: row.name,
        role: row.role || 'user',
        isSeller: row.role === 'seller',
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    } catch (error) {
      throw new Error(`Erreur recherche utilisateurs: ${error.message}`);
    }
  }

  async update(user) {
    const query = `
      UPDATE users 
      SET email = ?, name = ?, role = ?
      WHERE id = ?
    `;
    const values = [user.email, user.fullName || user.name, user.role || 'user', user.id];
    try {
      await this.db.getPool().execute(query, values);
      return user;
    } catch (error) {
      throw new Error(`Erreur mise à jour utilisateur: ${error.message}`);
    }
  }

  async delete(id) {
    const query = 'DELETE FROM users WHERE id = ?';
    try {
      await this.db.getPool().execute(query, [id]);
    } catch (error) {
      throw new Error(`Erreur suppression utilisateur: ${error.message}`);
    }
  }
}

module.exports = UserRepository;