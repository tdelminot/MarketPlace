// backend/scripts/upload-demo-images.js
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '../.env') });

// Configurer Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Dossier des images de démonstration
const uploadDir = path.join(__dirname, '../uploads');

async function uploadImages() {
  try {
    console.log('📸 Upload des images de démonstration sur Cloudinary...');
    console.log(`📁 Dossier: ${uploadDir}`);
    
    // Lire tous les fichiers du dossier
    const files = fs.readdirSync(uploadDir);
    console.log(`📄 ${files.length} fichiers trouvés`);
    
    let uploaded = 0;
    let errors = 0;
    
    for (const file of files) {
      const filePath = path.join(uploadDir, file);
      const stat = fs.statSync(filePath);
      
      // Ignorer les dossiers
      if (!stat.isFile()) continue;
      
      // Ignorer les fichiers qui ne sont pas des images
      const ext = path.extname(file).toLowerCase();
      if (!['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext)) continue;
      
      try {
        console.log(`📤 Uploading: ${file}...`);
        
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'marketplace/demo',
          public_id: path.parse(file).name,
          overwrite: true
        });
        
        console.log(`✅ ${file} → ${result.secure_url}`);
        uploaded++;
      } catch (error) {
        console.error(`❌ Erreur pour ${file}:`, error.message);
        errors++;
      }
    }
    
    console.log(`\n✅ Upload terminé !`);
    console.log(`   📸 ${uploaded} images uploadées`);
    console.log(`   ❌ ${errors} erreurs`);
    console.log(`\n📋 Les URLs sont disponibles dans votre dashboard Cloudinary:`);
    console.log(`   https://cloudinary.com/console/media_library`);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

uploadImages();