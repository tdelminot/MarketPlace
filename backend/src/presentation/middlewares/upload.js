const { upload } = require('../../infrastructure/upload/cloudinary.config');

// Réexporter le middleware Cloudinary
module.exports = upload;