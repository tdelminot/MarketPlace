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
  console.log('📸 Upload des images de démonstration sur Cloudinary...');
  
  const files = fs.readdirSync(uploadDir);
  const jpgFiles = files.filter(f => f.endsWith('.jpg') && !f.includes('_1')); // Filtrer les vraies photos
  
  console.log(`📄 ${jpgFiles.length} fichiers JPG trouvés`);
  
  for (const file of jpgFiles) {
    const filePath = path.join(uploadDir, file);
    const publicId = path.parse(file).name;
    
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'marketplace/demo',
        public_id: publicId,
        overwrite: true
      });
      console.log(`✅ ${file} → ${result.secure_url}`);
    } catch (error) {
      console.error(`❌ Erreur pour ${file}:`, error.message);
    }
  }
}

uploadImages();