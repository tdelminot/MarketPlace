const Product = require('../../domain/entities/Product');

class CreateProductUseCase {
  constructor(productRepository, userRepository) {
    this.productRepository = productRepository;
    this.userRepository = userRepository;
  }

  async execute(productData) {
    const { sellerId, title, description, sellerArgs, price, category, images, condition, location } = productData;

    // Vérifier que le vendeur existe et est vendeur
    const seller = await this.userRepository.findById(sellerId);
    if (!seller) {
      throw new Error('Vendeur non trouvé');
    }

    if (!seller.isSeller) {
      throw new Error('Vous devez être vendeur pour publier une annonce');
    }

    // Créer le produit
    const product = new Product({
      sellerId,
      title,
      description,
      sellerArgs,
      price,
      category,
      images,
      condition,
      location
    });

    await this.productRepository.save(product);
    return product;
  }
}

module.exports = CreateProductUseCase;