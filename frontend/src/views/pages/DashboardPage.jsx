import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import authViewModel from '../../viewmodels/AuthViewModel';
import ProductViewModel from '../../viewmodels/ProductViewModel';
import StatsViewModel from '../../viewmodels/StatsViewModel';
import StatsCard from '../components/StatsCard';

const productViewModel = new ProductViewModel();
const statsViewModel = new StatsViewModel();

const DashboardPage = observer(() => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authViewModel.isAuthenticated) {
      navigate('/login');
      return;
    }

    if (authViewModel.user?.id) {
      statsViewModel.loadStats(authViewModel.user.id);
      productViewModel.loadProducts({ sellerId: authViewModel.user.id });
    }
  }, [authViewModel.isAuthenticated]);

  if (!authViewModel.isAuthenticated) {
    return null;
  }

  const user = authViewModel.user;
  const products = productViewModel.products;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>📊 Tableau de bord</h1>
        <p>Bienvenue, {user?.fullName || user?.email}</p>
        {!user?.isSeller && (
          <button 
            className="become-seller-btn"
            onClick={async () => {
              await authViewModel.becomeSeller();
              if (authViewModel.user?.isSeller) {
                window.location.reload();
              }
            }}
          >
            🔑 Devenir vendeur
          </button>
        )}
      </div>

      {user?.isSeller ? (
        <>
          <StatsCard stats={statsViewModel.stats} />

          <div className="dashboard-products">
            <h2>📦 Mes produits ({products.length})</h2>
            <div className="dashboard-products-grid">
              {products.map(product => (
                <motion.div 
                  key={product.id}
                  className="dashboard-product-item"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="product-item-info">
                    <img 
                      src={product.mainImage ? `http://localhost:5000${product.mainImage}` : '/placeholder.jpg'} 
                      alt={product.title}
                    />
                    <div>
                      <h4>{product.title}</h4>
                      <p>{product.formattedPrice}</p>
                      <span className={`status-badge ${product.status}`}>
                        {product.status === 'available' ? 'Actif' : 'Vendu'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="dashboard-empty">
          <div className="empty-icon">🚀</div>
          <h3>Devenez vendeur</h3>
          <p>Publiez vos annonces et commencez à vendre dès maintenant !</p>
          <button 
            className="become-seller-btn large"
            onClick={async () => {
              await authViewModel.becomeSeller();
              if (authViewModel.user?.isSeller) {
                window.location.reload();
              }
            }}
          >
            🔑 Devenir vendeur maintenant
          </button>
        </div>
      )}
    </div>
  );
});

export default DashboardPage;