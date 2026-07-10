class PurchaseProductUseCase {
  constructor(productRepository, userRepository) {
    this.productRepository = productRepository;
    this.userRepository = userRepository;
  }

  async execute(productId, buyerId) {
    console.log(`🛒 Achat du produit ${productId} par ${buyerId}`);
    
    // Récupérer le produit
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('Produit non trouvé');
    }

    if (product.status !== 'available') {
      throw new Error('Ce produit n\'est plus disponible');
    }

    if (product.sellerId === buyerId) {
      throw new Error('Vous ne pouvez pas acheter votre propre produit');
    }

    // Vérifier que l'acheteur existe
    const buyer = await this.userRepository.findById(buyerId);
    if (!buyer) {
      console.error(`❌ Acheteur non trouvé: ${buyerId}`);
      throw new Error('Acheteur non trouvé');
    }

    console.log(`✅ Achat simulé: ${buyer.email} achète ${product.title} pour ${product.price}€`);

    // Marquer le produit comme vendu
    await this.productRepository.updateStatus(productId, 'sold');

    // Retourner les détails de la transaction
    return {
      product: {
        id: product.id,
        title: product.title,
        price: product.price
      },
      buyer: {
        id: buyer.id,
        email: buyer.email,
        name: buyer.fullName || buyer.name
      },
      message: `Félicitations ! Vous avez acheté "${product.title}" pour ${product.price}€`,
      transactionId: `TRX-${Date.now()}`
    };
  }
}

module.exports = PurchaseProductUseCase;
