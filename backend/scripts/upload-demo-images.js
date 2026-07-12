 
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configurer Cloudinary (avec tes identifiants)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadDir = path.join(__dirname, '../uploads');
const files = fs.readdirSync(uploadDir);

for (const file of files) {
  const filePath = path.join(uploadDir, file);
  if (!fs.statSync(filePath).isFile()) continue;
  
  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'marketplace/demo',
    public_id: path.parse(file).name
  });
  console.log(`✅ Uploadé: ${file} → ${result.secure_url}`);
}