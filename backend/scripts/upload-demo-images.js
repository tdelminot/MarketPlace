// backend/scripts/upload-demo-images.js
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadDir = path.join(__dirname, '../uploads');

async function uploadImages() {
  try {
    console.log('📸 Upload des images de démonstration sur Cloudinary...');
    console.log(`📁 Dossier: ${uploadDir}`);
    
    // Lire tous les fichiers du dossier
    const files = fs.readdirSync(uploadDir);
    
    // Filtrer uniquement les fichiers JPG (les vraies photos)
    const jpgFiles = files.filter(f => 
      f.endsWith('.jpg') && !f.includes('_1')
    );
    
    console.log(`📄 ${jpgFiles.length} fichiers JPG trouvés`);
    
    let uploaded = 0;
    let errors = 0;
    
    for (const file of jpgFiles) {
      const filePath = path.join(uploadDir, file);
      
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
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

uploadImages();