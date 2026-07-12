 
const express = require('express');
const upload = require('../middlewares/upload');
const { authMiddleware, sellerMiddleware } = require('../middlewares/auth');

const router = express.Router();

module.exports = (controller) => {
  // Routes publiques
  router.get('/', (req, res) => controller.getAll(req, res));
  router.get('/:id', (req, res) => controller.getById(req, res));
  
  // Routes protégées
  router.post('/create', 
    authMiddleware, 
    sellerMiddleware, 
    upload.array('images', 5), // 5 images max sur Cloudinary
    (req, res) => controller.create(req, res)
  );
  
  router.post('/:productId/purchase', 
    authMiddleware, 
    (req, res) => controller.purchase(req, res)
  );
  
  router.delete('/:id', 
    authMiddleware, 
    (req, res) => controller.delete(req, res)
  );
  
  // 🔥 Nouvelle route pour supprimer une image de Cloudinary
  router.delete('/image/:publicId', 
    authMiddleware, 
    (req, res) => controller.deleteImage(req, res)
  );
  
  return router;
};