 
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

// Liste des produits avec leurs images Cloudinary
const products = [
  {
    title: 'iPhone 13 Pro',
    description: 'Excellent état, vendu avec chargeur et écran de protection',
    price: 650,
    category: 'electronics',
    condition: 'excellent',
    location: 'Paris',
    images: ['https://res.cloudinary.com/nljnvgq3/image/upload/v...'] // À remplacer par les vraies URLs
  },
  // Ajout d'autres produits...
];

async function seedProducts() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    // Récupérer un vendeur existant
    const [users] = await connection.query('SELECT id FROM users LIMIT 1');
    if (users.length === 0) {
      console.log('❌ Aucun utilisateur trouvé. Crée d\'abord un compte.');
      return;
    }
    
    const sellerId = users[0].id;
    
    for (const product of products) {
      await connection.query(
        'INSERT INTO products (title, description, price, category, condition, location, images, seller_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [product.title, product.description, product.price, product.category, product.condition, product.location, JSON.stringify(product.images), sellerId, 'available']
      );
      console.log(`✅ Produit ajouté: ${product.title}`);
    }
    
    console.log('✅ Base de données peuplée avec succès !');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await connection.end();
  }
}

seedProducts();