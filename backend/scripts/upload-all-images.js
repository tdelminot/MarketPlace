// backend/scripts/upload-all-images.js
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '../.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ✅ Chemin CORRECT : remonter d'un niveau pour aller de scripts/ à backend/
const uploadDir = path.join(__dirname, '..', 'uploads');
// OU en utilisant le chemin absolu
// const uploadDir = 'C:/Users/DELL/Nouveau_dossier_5/Nouveau dossier/MarketPlace/backend/uploads';

async function uploadAllImages() {
  try {
    console.log('📸 Upload de toutes les images...');
    console.log(`📁 Dossier: ${uploadDir}`);
    
    // Vérifier si le dossier existe
    if (!fs.existsSync(uploadDir)) {
      console.error(`❌ Le dossier ${uploadDir} n'existe pas !`);
      process.exit(1);
    }
    
    const files = fs.readdirSync(uploadDir);
    const imageFiles = files.filter(f => {
      const ext = path.extname(f).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext);
    });
    
    console.log(`📄 ${imageFiles.length} fichiers images trouvés`);
    
    let uploaded = 0;
    let errors = 0;
    
    for (const file of imageFiles) {
      const filePath = path.join(uploadDir, file);
      const publicId = path.parse(file).name;
      
      try {
        console.log(`📤 Upload: ${file}...`);
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'marketplace/demo',
          public_id: publicId,
          overwrite: true
        });
        console.log(`✅ ${file} → ${result.secure_url}`);
        uploaded++;
      } catch (error) {
        console.error(`❌ Erreur pour ${file}:`, error.message);
        errors++;
      }
    }
    
    console.log(`\n🎉 ${uploaded} images uploadées, ${errors} erreurs`);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

uploadAllImages();