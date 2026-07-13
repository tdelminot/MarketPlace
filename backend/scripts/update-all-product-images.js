// backend/scripts/update-all-product-images.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

// Nouvelles URLs Cloudinary (timestamp v1783860+)
const imageMap = {
  'bose_1': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860744/marketplace/demo/bose_1.jpg',
  'canon_1': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860745/marketplace/demo/canon_1.jpg',
  'chesterfield_1': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860747/marketplace/demo/chesterfield_1.jpg',
  'giant_1': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860749/marketplace/demo/giant_1.jpg',
  'golf_1': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860750/marketplace/demo/golf_1.jpg',
  'hp_1': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860751/marketplace/demo/hp_1.jpg',
  'iphone12_1': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860753/marketplace/demo/iphone12_1.jpg',
  'iphone13_1': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860754/marketplace/demo/iphone13_1.jpg',
  'jordan_1': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860755/marketplace/demo/jordan_1.jpg',
  'lampadaire_1': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860757/marketplace/demo/lampadaire_1.jpg',
  'lego_1': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860758/marketplace/demo/lego_1.jpg',
  'lv_1': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860759/marketplace/demo/lv_1.jpg',
  'macbook_1': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860760/marketplace/demo/macbook_1.jpg',
  'omega_1': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860762/marketplace/demo/omega_1.jpg',
  'polo_1': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860763/marketplace/demo/polo_1.jpg',
  'ps5_1': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860764/marketplace/demo/ps5_1.jpg',
  'surf_1': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860766/marketplace/demo/surf_1.jpg',
  'taylor_1': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860767/marketplace/demo/taylor_1.jpg',
  'trek_1': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860769/marketplace/demo/trek_1.jpg',
  'veste_1': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860770/marketplace/demo/veste_1.jpg',
  'yamaha_1': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860771/marketplace/demo/yamaha_1.jpg'
};

async function updateAllProducts() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    console.log('🔄 Mise à jour de tous les produits avec les nouvelles URLs...');
    
    const [products] = await connection.query('SELECT id, title, images FROM products');
    console.log(`📦 ${products.length} produits trouvés`);
    
    let updated = 0;
    let unchanged = 0;
    
    for (const product of products) {
      let currentImages = [];
      try {
        currentImages = JSON.parse(product.images || '[]');
      } catch {
        currentImages = [];
      }
      
      if (currentImages.length === 0) continue;
      
      const currentUrl = currentImages[0];
      let found = false;
      
      for (const [key, newUrl] of Object.entries(imageMap)) {
        if (currentUrl.includes(key)) {
          await connection.query(
            'UPDATE products SET images = ? WHERE id = ?',
            [JSON.stringify([newUrl]), product.id]
          );
          console.log(`✅ ${product.title} → mis à jour`);
          updated++;
          found = true;
          break;
        }
      }
      
      if (!found) {
        unchanged++;
      }
    }
    
    console.log(`\n🎉 ${updated} produits mis à jour, ${unchanged} inchangés`);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await connection.end();
  }
}

updateAllProducts();