import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import ProductViewModel from '../../viewmodels/ProductViewModel';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { FiSearch } from 'react-icons/fi';

const productViewModel = new ProductViewModel();

const HomePage = observer(() => {
  const [filters, setFilters] = useState({ category: 'all', search: '' });
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    productViewModel.loadProducts(filters);
  }, [filters]);

  const handlePurchase = async (productId) => {
    const result = await productViewModel.purchaseProduct(productId);
    if (result) {
      alert(`✅ Achat réussi !\n${result.message}`);
      setSelectedProductId(null);
      productViewModel.loadProducts(filters);
    }
  };

  const selectedProduct = productViewModel.products.find(p => p.id === selectedProductId);

  return (
    <div className="home-container">
      {/* Header */}
      <section className="hero-section">
        <h1>🛒 MarketPlace</h1>
        <p>Découvrez des objets uniques vendus par des particuliers</p>
        
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        <div className="category-filters">
          {['all', 'electronics', 'clothing', 'books', 'sport', 'music', 'other'].map((cat) => (
            <button
              key={cat}
              className={`category-btn ${filters.category === cat ? 'active' : ''}`}
              onClick={() => setFilters({ ...filters, category: cat })}
            >
              {cat === 'all' ? 'Tous' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="products-section">
        {productViewModel.isLoading ? (
          <div className="loading-spinner">Chargement...</div>
        ) : productViewModel.products.length === 0 ? (
          <div className="empty-products">
            <p>Aucun produit trouvé</p>
          </div>
        ) : (
          <div className="products-grid">
            {productViewModel.products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedProductId(product.id)}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProductId(null)}
        onPurchase={handlePurchase}
      />
    </div>
  );
});

export default HomePage;