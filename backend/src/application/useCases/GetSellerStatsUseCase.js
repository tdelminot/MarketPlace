class GetSellerStatsUseCase {
  constructor(productRepository, userRepository) {
    this.productRepository = productRepository;
    this.userRepository = userRepository;
  }

  async execute(sellerId) {
    const seller = await this.userRepository.findById(sellerId);
    if (!seller) {
      throw new Error('Vendeur non trouvé');
    }

    // Récupérer tous les produits du vendeur
    const products = await this.productRepository.findBySeller(sellerId);
    
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status === 'active').length;
    const soldProducts = products.filter(p => p.status === 'sold').length;
    
    // Calculer les revenus (simulé)
    const totalRevenue = products
      .filter(p => p.status === 'sold')
      .reduce((sum, p) => sum + p.price, 0);
    
    // Total des vues
    const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0);
    
    // Taux de conversion (simulé)
    const conversionRate = totalProducts > 0 
      ? (soldProducts / totalProducts) * 100 
      : 0;

    return {
      totalProducts,
      activeProducts,
      soldProducts,
      totalRevenue,
      totalViews,
      conversionRate: parseFloat(conversionRate.toFixed(2)),
      products
    };
  }
}

module.exports = GetSellerStatsUseCase;