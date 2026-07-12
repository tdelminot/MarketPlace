 
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

// Mapping des produits avec placeholder vers leurs vraies images
const fixMap = [
  { pattern: 'PlayStation', images: ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852844/marketplace/demo/ps5_1.jpg'] },
  { pattern: 'Giant', images: ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852797/marketplace/demo/giant_1.jpg'] },
  { pattern: 'Trek', images: ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852858/marketplace/demo/trek_1.jpg'] },
  { pattern: 'Polo', images: ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852841/marketplace/demo/polo_1.jpg'] },
  { pattern: 'Ralph', images: ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852841/marketplace/demo/polo_1.jpg'] },
  { pattern: 'Chesterfield', images: ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852791/marketplace/demo/chesterfield_1.jpg'] },
  { pattern: 'Canap', images: ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852791/marketplace/demo/chesterfield_1.jpg'] },
  { pattern: 'Lampadaire', images: ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852820/marketplace/demo/lampadaire_1.jpg'] },
  { pattern: 'Yamaha', images: ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852867/marketplace/demo/yamaha_1.jpg'] },
  { pattern: 'Piano', images: ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852867/marketplace/demo/yamaha_1.jpg'] }
];

async function fixPlaceholders() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    console.log('🔄 Correction des produits avec placeholder...');
    
    // Récupérer les produits avec placeholder
    const placeholderUrl = 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783852839/marketplace/demo/placeholder.svg';
    const [products] = await connection.query(
      'SELECT id, title FROM products WHERE images LIKE ?',
      [`%${placeholderUrl}%`]
    );
    console.log(`📦 ${products.length} produits avec placeholder trouvés`);
    
    let updated = 0;
    for (const product of products) {
      let found = false;
      for (const fix of fixMap) {
        if (product.title.includes(fix.pattern)) {
          await connection.query(
            'UPDATE products SET images = ? WHERE id = ?',
            [JSON.stringify(fix.images), product.id]
          );
          console.log(`✅ ${product.title} → ${fix.pattern} mis à jour`);
          updated++;
          found = true;
          break;
        }
      }
      if (!found) {
        console.log(`⚠️ ${product.title} → toujours placeholder`);
      }
    }
    
    console.log(`\n🎉 ${updated} produits corrigés sur ${products.length}`);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await connection.end();
  }
}

fixPlaceholders();
