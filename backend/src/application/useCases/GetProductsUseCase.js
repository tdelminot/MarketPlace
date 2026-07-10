class GetProductsUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(filters = {}) {
    const products = await this.productRepository.findAll(filters);
    return products;
  }

  async getProductById(id) {
    try {
      console.log(`🔍 GetProductsUseCase: recherche du produit ${id}`);
      const product = await this.productRepository.findById(id);
      if (product) {
        console.log(`✅ Produit ${id} trouvé`);
        // Incrémenter les vues
        await this.productRepository.incrementViews(id);
      } else {
        console.log(`❌ Produit ${id} non trouvé`);
      }
      return product;
    } catch (error) {
      console.error(`❌ Erreur getProductById:`, error);
      throw error;
    }
  }
}

module.exports = GetProductsUseCase;