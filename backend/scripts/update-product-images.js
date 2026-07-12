 // backend/scripts/update-product-images.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '../.env') });

// Mapping des produits vers leurs images Cloudinary (URLs uploadées)
const imageMap = {
  'iPhone 13 Pro 256GB - Graphite': ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852811/marketplace/demo/iphone13_1.jpg'],
  'MacBook Pro M1 14" - 16GB/512GB': ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852831/marketplace/demo/macbook_1.jpg'],
  'Sony PlayStation 5 - Édition Standard': ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852844/marketplace/demo/ps5_1.jpg'],
  'Bose QuietComfort 45 - Noir': ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852784/marketplace/demo/bose_1.jpg'],
  'Canon EOS R6 + Objectif 24-105mm': ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852787/marketplace/demo/canon_1.jpg'],
  'Vélo de route Trek Domane SL 5': ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852858/marketplace/demo/trek_1.jpg'],
  'Planche de surf CI Pod Mod 5\'10"': ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852848/marketplace/demo/surf_1.jpg'],
  'Guitare acoustique Taylor 814ce': ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852854/marketplace/demo/taylor_1.jpg'],
  'Piano numérique Yamaha P-515': ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852867/marketplace/demo/yamaha_1.jpg'],
  'Montre Omega Seamaster 300M': ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852836/marketplace/demo/omega_1.jpg'],
  'Nike Air Jordan 1 Retro High': ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852815/marketplace/demo/jordan_1.jpg'],
  'Sac Louis Vuitton Speedy 30': ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852826/marketplace/demo/lv_1.jpg'],
  'Canapé Chesterfield 3 places': ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852791/marketplace/demo/chesterfield_1.jpg'],
  'Lego Star Wars Millennium Falcon': ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852823/marketplace/demo/lego_1.jpg'],
  'Figurine Star Wars - Boba Fett': ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852778/marketplace/demo/boba_1.svg'],
  'Vélo électrique Giant Explore E+': ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852797/marketplace/demo/giant_1.jpg'],
  'Set de golf Titleist T300': ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852800/marketplace/demo/golf_1.jpg'],
  'Polo Ralph Lauren - Collection été': ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852841/marketplace/demo/polo_1.jpg'],
  'Veste en cuir Schott NYC 613': ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852862/marketplace/demo/veste_1.jpg'],
  'Table basse design en marbre': ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852851/marketplace/demo/table_1.svg'],
  'Lampadaire design en bois et métal': ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852820/marketplace/demo/lampadaire_1.jpg'],
  'HP Spectre x360': ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852804/marketplace/demo/hp_1.jpg'],
  'iPhone 12 Pro 128GB - Argent': ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852807/marketplace/demo/iphone12_1.jpg'],
  'Collection Harry Potter - 7 tomes': ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852839/marketplace/demo/placeholder.svg']
};

async function updateImages() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    console.log('🔄 Mise à jour des images des produits...');
    
    // Récupérer tous les produits
    const [products] = await connection.query('SELECT id, title FROM products');
    console.log(`📦 ${products.length} produits trouvés`);
    
    let updated = 0;
    let notFound = 0;
    
    for (const product of products) {
      if (imageMap[product.title]) {
        await connection.query(
          'UPDATE products SET images = ? WHERE id = ?',
          [JSON.stringify(imageMap[product.title]), product.id]
        );
        console.log(`✅ ${product.title} → images mises à jour`);
        updated++;
      } else {
        console.log(`⚠️ Aucune image trouvée pour: ${product.title}`);
        notFound++;
      }
    }
    
    console.log(`\n🎉 ${updated} produits mis à jour sur ${products.length}`);
    if (notFound > 0) {
      console.log(`⚠️ ${notFound} produits sans image (à ajouter manuellement)`);
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await connection.end();
  }
}

updateImages();