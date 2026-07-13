// backend/scripts/force-update-product-images.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

// Mapping des produits vers leurs nouvelles URLs Cloudinary
const productImages = {
  'Bose QuietComfort 45 - Noir': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860744/marketplace/demo/bose_1.jpg',
  'Set de golf Titleist T300': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860750/marketplace/demo/golf_1.jpg',
  'Canon EOS R6 + Objectif 24-105mm': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860745/marketplace/demo/canon_1.jpg',
  'Sony PlayStation 5 - Édition Standard': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860764/marketplace/demo/ps5_1.jpg',
  'Vélo électrique Giant Explore E+': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860749/marketplace/demo/giant_1.jpg',
  'Vélo de route Trek Domane SL 5': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860769/marketplace/demo/trek_1.jpg',
  'Planche de surf CI Pod Mod 5\'10"': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860766/marketplace/demo/surf_1.jpg',
  'Polo Ralph Lauren - Collection été': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860763/marketplace/demo/polo_1.jpg',
  'Veste en cuir Schott NYC 613': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860770/marketplace/demo/veste_1.jpg',
  'Canapé Chesterfield 3 places': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860747/marketplace/demo/chesterfield_1.jpg',
  'MacBook Pro M1 14" - 16GB/512GB': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860760/marketplace/demo/macbook_1.jpg',
  'iPhone 13 Pro 256GB - Graphite': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860754/marketplace/demo/iphone13_1.jpg',
  'iPhone 12 Pro 128GB - Argent': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860753/marketplace/demo/iphone12_1.jpg',
  'Nike Air Jordan 1 Retro High': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860755/marketplace/demo/jordan_1.jpg',
  'Sac Louis Vuitton Speedy 30': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860759/marketplace/demo/lv_1.jpg',
  'Montre Omega Seamaster 300M': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860762/marketplace/demo/omega_1.jpg',
  'Guitare acoustique Taylor 814ce': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860767/marketplace/demo/taylor_1.jpg',
  'Piano numérique Yamaha P-515': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860771/marketplace/demo/yamaha_1.jpg',
  'Lego Star Wars Millennium Falcon': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860758/marketplace/demo/lego_1.jpg',
  'Figurine Star Wars - Boba Fett': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860756/marketplace/demo/boba_1.jpg',
  'Lampadaire design en bois et métal': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860757/marketplace/demo/lampadaire_1.jpg',
  'Table basse design en marbre': 'https://res.cloudinary.com/nljnvgq3/image/upload/v1783860772/marketplace/demo/table_1.jpg'
};

async function forceUpdate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    console.log('🔄 Mise à jour forcée des images...');
    
    const [products] = await connection.query('SELECT id, title, images FROM products');
    console.log(`📦 ${products.length} produits trouvés`);
    
    let updated = 0;
    
    for (const product of products) {
      // Nettoyer le titre pour correspondre au mapping
      let title = product.title;
      
      // Rechercher une correspondance
      let newImage = null;
      for (const [key, value] of Object.entries(productImages)) {
        if (title.includes(key) || key.includes(title)) {
          newImage = value;
          break;
        }
      }
      
      if (newImage) {
        await connection.query(
          'UPDATE products SET images = ? WHERE id = ?',
          [JSON.stringify([newImage]), product.id]
        );
        console.log(`✅ ${product.title} → mis à jour`);
        updated++;
      } else {
        console.log(`⚠️ Aucune correspondance pour: ${product.title}`);
      }
    }
    
    console.log(`\n🎉 ${updated} produits mis à jour sur ${products.length}`);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await connection.end();
  }
}

forceUpdate();