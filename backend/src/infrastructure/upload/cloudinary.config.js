// backend/src/infrastructure/upload/cloudinary.config.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Charger le .env manuellement aussi pour ce fichier
const envPath = path.join(__dirname, '../../..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length) {
        const value = valueParts.join('=').trim();
        process.env[key.trim()] = value.replace(/^["']|["']$/g, '');
      }
    }
  });
}

console.log('🔍 Vérification Cloudinary:');
console.log(`   Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME || 'non défini'}`);
console.log(`   API Key: ${process.env.CLOUDINARY_API_KEY || 'non défini'}`);
console.log(`   API Secret: ${process.env.CLOUDINARY_API_SECRET ? '✅ défini' : '❌ non défini'}`);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'marketplace/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }]
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées'), false);
    }
  }
});

module.exports = { upload, cloudinary };