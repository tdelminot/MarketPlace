class StatsService {
  constructor(productRepository, userRepository) {
    this.productRepository = productRepository;
    this.userRepository = userRepository;
  }

  async getSellerStats(sellerId) {
    // Vérifier que le vendeur existe
    const seller = await this.userRepository.findById(sellerId);
    if (!seller) {
      throw new Error('Vendeur non trouvé');
    }

    // Récupérer tous les produits du vendeur
    const products = await this.productRepository.findBySeller(sellerId);
    
    // Calculer les statistiques
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status === 'active').length;
    const soldProducts = products.filter(p => p.status === 'sold').length;
    
    // Calculer les revenus totaux
    const totalRevenue = products
      .filter(p => p.status === 'sold')
      .reduce((sum, p) => sum + parseFloat(p.price), 0);
    
    // Total des vues
    const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0);
    
    // Taux de conversion
    const conversionRate = totalProducts > 0 
      ? (soldProducts / totalProducts) * 100 
      : 0;

    // Produits par catégorie
    const productsByCategory = {};
    products.forEach(p => {
      const category = p.category || 'other';
      productsByCategory[category] = (productsByCategory[category] || 0) + 1;
    });

    // Produits par statut
    const productsByStatus = {
      active: activeProducts,
      sold: soldProducts,
      inactive: products.filter(p => p.status === 'inactive').length
    };

    // Ventes par mois (pour les 6 derniers mois)
    const salesByMonth = {};
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
      salesByMonth[key] = 0;
    }

    products
      .filter(p => p.status === 'sold' && p.updatedAt)
      .forEach(p => {
        const date = new Date(p.updatedAt);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (salesByMonth[key] !== undefined) {
          salesByMonth[key] += parseFloat(p.price);
        }
      });

    // Top 5 produits les plus vus
    const topViewedProducts = [...products]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5)
      .map(p => ({
        id: p.id,
        title: p.title,
        views: p.views || 0,
        price: p.price,
        status: p.status
      }));

    return {
      totalProducts,
      activeProducts,
      soldProducts,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      totalViews,
      conversionRate: parseFloat(conversionRate.toFixed(2)),
      productsByCategory,
      productsByStatus,
      salesByMonth,
      topViewedProducts,
      recentSales: products
        .filter(p => p.status === 'sold')
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5)
        .map(p => ({
          title: p.title,
          price: p.price,
          soldAt: p.updatedAt
        }))
    };
  }

  async getProductStats(productId) {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('Produit non trouvé');
    }

    // Statistiques du produit
    return {
      id: product.id,
      title: product.title,
      views: product.views || 0,
      status: product.status,
      price: product.price,
      createdAt: product.createdAt,
      category: product.category,
      condition: product.condition,
      location: product.location
    };
  }

  async getPlatformStats() {
    // Statistiques globales de la plateforme
    const allProducts = await this.productRepository.findAll();
    const allUsers = await this.userRepository.findAll();

    const totalProducts = allProducts.length;
    const totalSellers = allUsers.filter(u => u.isSeller).length;
    const totalBuyers = allUsers.filter(u => !u.isSeller).length;
    
    const totalRevenue = allProducts
      .filter(p => p.status === 'sold')
      .reduce((sum, p) => sum + parseFloat(p.price), 0);

    const totalViews = allProducts.reduce((sum, p) => sum + (p.views || 0), 0);

    const categories = {};
    allProducts.forEach(p => {
      const category = p.category || 'other';
      categories[category] = (categories[category] || 0) + 1;
    });

    return {
      totalProducts,
      totalSellers,
      totalBuyers,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      totalViews,
      categories,
      averagePrice: totalProducts > 0 
        ? parseFloat((totalRevenue / totalProducts).toFixed(2)) 
        : 0
    };
  }
}

module.exports = StatsService;