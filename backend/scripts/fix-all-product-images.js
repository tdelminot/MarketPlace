// backend/scripts/fix-all-product-images.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

// Mapping des noms de produits vers les URLs Cloudinary
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

// Fonction pour parser les images (gère les différents formats)
function parseImages(imagesField) {
  if (!imagesField) return [];
  if (Array.isArray(imagesField)) return imagesField;
  if (typeof imagesField === 'string') {
    try {
      const parsed = JSON.parse(imagesField);
      if (Array.isArray(parsed)) return parsed;
      if (typeof parsed === 'string') return [parsed];
      return [];
    } catch {
      // Si ce n'est pas du JSON, c'est probablement une chaîne simple
      if (imagesField.startsWith('/uploads/') || imagesField.startsWith('http')) {
        return [imagesField];
      }
      return [];
    }
  }
  return [];
}

async function fixAllImages() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    console.log('🔄 Mise à jour de toutes les images...');
    
    // Récupérer tous les produits
    const [products] = await connection.query('SELECT id, title, images FROM products');
    console.log(`📦 ${products.length} produits trouvés`);
    
    let updated = 0;
    let alreadyCloudinary = 0;
    let placeholder = 0;
    
    for (const product of products) {
      const currentImages = parseImages(product.images);
      const isCloudinary = currentImages.length > 0 && currentImages[0].includes('cloudinary.com');
      
      if (isCloudinary) {
        alreadyCloudinary++;
        console.log(`✅ ${product.title} → déjà sur Cloudinary`);
        continue;
      }
      
      // Chercher une correspondance dans le mapping
      let newImages = null;
      for (const [title, cloudinaryImages] of Object.entries(imageMap)) {
        // Correspondance exacte ou partielle
        if (product.title === title || product.title.includes(title) || title.includes(product.title)) {
          newImages = cloudinaryImages;
          break;
        }
      }
      
      if (newImages) {
        await connection.query(
          'UPDATE products SET images = ? WHERE id = ?',
          [JSON.stringify(newImages), product.id]
        );
        console.log(`✅ ${product.title} → mis à jour vers Cloudinary`);
        updated++;
      } else {
        // Image par défaut
        const defaultImage = ['https://res.cloudinary.com/nljnvgq3/image/upload/v1783852839/marketplace/demo/placeholder.svg'];
        await connection.query(
          'UPDATE products SET images = ? WHERE id = ?',
          [JSON.stringify(defaultImage), product.id]
        );
        console.log(`⚠️ ${product.title} → placeholder ajouté`);
        placeholder++;
      }
    }
    
    console.log(`\n🎉 Résumé:`);
    console.log(`   ✅ ${updated} produits mis à jour vers Cloudinary`);
    console.log(`   ✅ ${alreadyCloudinary} produits déjà sur Cloudinary`);
    console.log(`   ℹ️ ${placeholder} produits avec placeholder`);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await connection.end();
  }
}

fixAllImages();