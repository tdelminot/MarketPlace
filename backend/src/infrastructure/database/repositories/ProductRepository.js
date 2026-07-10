const IProductRepository = require('../../../domain/repositories/IProductRepository');

class ProductRepository extends IProductRepository {
  constructor(dbConnection) {
    super();
    this.db = dbConnection;
  }

  async save(product) {
    const query = `
      INSERT INTO products (id, seller_id, title, description, price, category, \`condition\`, images, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      product.id,
      product.sellerId,
      product.title,
      product.description || '',
      product.price,
      product.category || 'other',
      product.condition || 'good',
      JSON.stringify(product.images || []),
      product.status || 'available',
      product.createdAt || new Date()
    ];

    try {
      await this.db.getPool().execute(query, values);
      return product;
    } catch (error) {
      throw new Error(`Erreur sauvegarde produit: ${error.message}`);
    }
  }

  async findById(id) {
    const query = `
      SELECT p.*, u.name as seller_name 
      FROM products p 
      LEFT JOIN users u ON p.seller_id = u.id 
      WHERE p.id = ?
    `;
    try {
      const [rows] = await this.db.getPool().execute(query, [id]);
      if (rows.length === 0) return null;
      const row = rows[0];
      return {
        id: row.id,
        sellerId: row.seller_id,
        title: row.title,
        description: row.description || '',
        price: row.price,
        category: row.category || 'other',
        condition: row.condition || 'good',
        images: this.parseImages(row.images),
        status: row.status || 'available',
        views: row.views || 0,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        seller: {
          name: row.seller_name || 'Vendeur'
        }
      };
    } catch (error) {
      throw new Error(`Erreur recherche produit: ${error.message}`);
    }
  }

  async findBySeller(sellerId) {
    const query = 'SELECT * FROM products WHERE seller_id = ? ORDER BY created_at DESC';
    try {
      const [rows] = await this.db.getPool().execute(query, [sellerId]);
      return rows.map(row => ({
        id: row.id,
        sellerId: row.seller_id,
        title: row.title,
        description: row.description || '',
        price: row.price,
        category: row.category || 'other',
        condition: row.condition || 'good',
        images: this.parseImages(row.images),
        status: row.status || 'available',
        views: row.views || 0,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    } catch (error) {
      throw new Error(`Erreur recherche produits vendeur: ${error.message}`);
    }
  }

  // Fonction utilitaire pour parser les images en toute sécurité
  parseImages(images) {
    if (!images) return [];
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      // Si ce n'est pas du JSON, retourner un tableau avec le chemin
      return [images];
    }
  }

  async findAll(filters = {}) {
    let query = `
      SELECT p.*, u.name as seller_name 
      FROM products p 
      LEFT JOIN users u ON p.seller_id = u.id 
      WHERE p.status = 'available'
    `;
    const values = [];

    if (filters.category && filters.category !== 'all') {
      query += ' AND p.category = ?';
      values.push(filters.category);
    }

    if (filters.search) {
      query += ' AND (p.title LIKE ? OR p.description LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm);
    }

    if (filters.minPrice) {
      query += ' AND p.price >= ?';
      values.push(parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      query += ' AND p.price <= ?';
      values.push(parseFloat(filters.maxPrice));
    }

    query += ' ORDER BY p.created_at DESC';
    
    const limit = parseInt(filters.limit) || 20;
    const offset = parseInt(filters.offset) || 0;
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    try {
      const [rows] = await this.db.getPool().execute(query, values);
      console.log(`✅ ${rows.length} produits trouvés`);
      return rows.map(row => {
        const product = {
          id: row.id,
          sellerId: row.seller_id,
          title: row.title,
          description: row.description || '',
          price: row.price,
          category: row.category || 'other',
          images: this.parseImages(row.images),
          status: row.status || 'available',
          views: row.views || 0,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          seller: {
            name: row.seller_name || 'Vendeur'
          }
        };
        if (row.condition !== undefined) {
          product.condition = row.condition;
        }
        return product;
      });
    } catch (error) {
      console.error('❌ Erreur findAll products:', error);
      throw new Error(`Erreur recherche produits: ${error.message}`);
    }
  }

  async update(product) {
    const query = `
      UPDATE products 
      SET title = ?, description = ?, price = ?, category = ?, \`condition\` = ?, images = ?, status = ?
      WHERE id = ?
    `;
    const values = [
      product.title,
      product.description || '',
      product.price,
      product.category || 'other',
      product.condition || 'good',
      JSON.stringify(product.images || []),
      product.status || 'available',
      product.id
    ];
    await this.db.getPool().execute(query, values);
    return product;
  }

  async delete(id) {
    const query = 'DELETE FROM products WHERE id = ?';
    await this.db.getPool().execute(query, [id]);
  }

  async incrementViews(id) {
  try {
    // Vérifier d'abord si la colonne views existe
    const query = 'UPDATE products SET views = views + 1 WHERE id = ?';
    await this.db.getPool().execute(query, [id]);
  } catch (error) {
    // Si la colonne n'existe pas, ignorer l'erreur
    console.log(`⚠️ Impossible d'incrémenter les vues: ${error.message}`);
  }
}

  async updateStatus(id, status) {
    const query = 'UPDATE products SET status = ? WHERE id = ?';
    await this.db.getPool().execute(query, [status, id]);
  }
}

module.exports = ProductRepository;