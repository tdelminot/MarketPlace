// backend/src/presentation/controllers/ProductController.js
const CreateProductUseCase = require('../../application/useCases/CreateProductUseCase');
const GetProductsUseCase = require('../../application/useCases/GetProductsUseCase');
const PurchaseProductUseCase = require('../../application/useCases/PurchaseProductUseCase');
const { cloudinary } = require('../../infrastructure/upload/cloudinary.config');

class ProductController {
  constructor(productRepository, userRepository) {
    this.productRepository = productRepository;
    this.userRepository = userRepository;
    this.createUseCase = new CreateProductUseCase(productRepository, userRepository);
    this.getUseCase = new GetProductsUseCase(productRepository);
    this.purchaseUseCase = new PurchaseProductUseCase(productRepository, userRepository);
  }

  async create(req, res) {
    try {
      const { title, description, sellerArgs, price, category, condition, location } = req.body;
      
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Utilisateur non authentifié' });
      }
      
      const sellerId = req.user.id;
      console.log('🛒 Création produit par:', sellerId);

      if (!title || !price) {
        return res.status(400).json({ 
          success: false, 
          error: 'Titre et prix requis' 
        });
      }

      // 🔥 Récupérer les URLs Cloudinary des images uploadées
      const images = req.files ? req.files.map(file => file.path) : [];
      console.log('📸 Images uploadées sur Cloudinary:', images);

      const product = await this.createUseCase.execute({
        sellerId,
        title,
        description: description || '',
        sellerArgs: sellerArgs || '',
        price: parseFloat(price),
        category: category || 'other',
        images, // URLs Cloudinary
        condition: condition || 'good',
        location: location || ''
      });

      console.log('✅ Produit créé:', product.id);

      res.status(201).json({
        success: true,
        product: product.toJSON ? product.toJSON() : product
      });
    } catch (error) {
      console.error('❌ Erreur create:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const { category, search, minPrice, maxPrice, limit, offset } = req.query;
      
      const products = await this.getUseCase.execute({
        category,
        search,
        minPrice,
        maxPrice,
        limit: limit || 20,
        offset: offset || 0
      });

      res.json({
        success: true,
        products,
        count: products.length
      });
    } catch (error) {
      console.error('❌ Erreur getAll:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      console.log(`🔍 Recherche du produit: ${id}`);
      
      const product = await this.getUseCase.getProductById(id);
      
      if (!product) {
        console.log(`❌ Produit ${id} non trouvé`);
        return res.status(404).json({ success: false, error: 'Produit non trouvé' });
      }

      console.log(`✅ Produit ${id} trouvé`);
      res.json({ success: true, product });
    } catch (error) {
      console.error(`❌ Erreur getById:`, error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async purchase(req, res) {
    try {
      const { productId } = req.params;
      const buyerId = req.user.id;
      
      console.log(`🛒 Achat du produit ${productId} par ${buyerId}`);

      const result = await this.purchaseUseCase.execute(productId, buyerId);
      
      console.log(`✅ Achat réussi:`, result);
      
      res.json({
        success: true,
        transaction: result
      });
    } catch (error) {
      console.error('❌ Erreur purchase:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const product = await this.productRepository.findById(id);
      
      if (!product) {
        return res.status(404).json({ success: false, error: 'Produit non trouvé' });
      }

      if (product.sellerId !== req.user.id) {
        return res.status(403).json({ 
          success: false, 
          error: 'Vous ne pouvez supprimer que vos propres produits' 
        });
      }

      // 🔥 Supprimer les images de Cloudinary
      if (product.images && product.images.length > 0) {
        for (const imageUrl of product.images) {
          try {
            // Extraire le public_id de l'URL Cloudinary
            const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(publicId);
            console.log(`🗑️ Image supprimée de Cloudinary: ${publicId}`);
          } catch (err) {
            console.warn('⚠️ Erreur suppression image Cloudinary:', err.message);
          }
        }
      }

      await this.productRepository.delete(id);
      
      res.json({ success: true, message: 'Produit supprimé' });
    } catch (error) {
      console.error('❌ Erreur delete:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // 🔥 Nouvelle méthode pour supprimer une image spécifique
  async deleteImage(req, res) {
    try {
      const { publicId } = req.params;
      const result = await cloudinary.uploader.destroy(publicId);
      res.json({ success: true, result });
    } catch (error) {
      console.error('❌ Erreur deleteImage:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = ProductController;