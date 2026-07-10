import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import { FiMapPin, FiTag, FiEye, FiArrowLeft, FiCalendar, FiShoppingCart } from 'react-icons/fi';
import toast from 'react-hot-toast';
import authViewModel from '../../viewmodels/AuthViewModel';
import ProductViewModel from '../../viewmodels/ProductViewModel';

const productViewModel = new ProductViewModel();

const ProductDetail = observer(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    productViewModel.loadProduct(id);
  }, [id]);

  const product = productViewModel.selectedProduct;
  const isLoading = productViewModel.isLoading;

  const handlePurchase = async () => {
    if (!authViewModel.isAuthenticated) {
      toast.error('Veuillez vous connecter pour acheter');
      navigate('/login');
      return;
    }

    setIsPurchasing(true);
    const result = await productViewModel.purchaseProduct(product.id);
    setIsPurchasing(false);

    if (result) {
      toast.success(`✅ Achat réussi !\n${result.message}`);
      navigate('/');
    } else {
      toast.error('Erreur lors de l\'achat');
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % (product?.images?.length || 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + (product?.images?.length || 1)) % (product?.images?.length || 1));
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement du produit...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <p>Produit non trouvé</p>
        <button onClick={() => navigate('/')}>Retour à l'accueil</button>
      </div>
    );
  }

  const images = product.images || [];
  const currentImage = images[currentImageIndex] 
    ? `http://localhost:5000${images[currentImageIndex]}`
    : '/placeholder.jpg';

  return (
    <motion.div 
      className="product-detail-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <button className="back-button" onClick={() => navigate('/')}>
        <FiArrowLeft /> Retour
      </button>

      <div className="product-detail-grid">
        {/* Images */}
        <div className="product-detail-images">
          <div className="main-image">
            <img 
              src={currentImage} 
              alt={product.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23667eea" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" dy=".3em" fill="white" font-size="40" text-anchor="middle"%3E📸%3C/text%3E%3C/svg%3E';
              }}
            />
            {product.status === 'sold' && (
              <div className="product-badge sold">Vendu</div>
            )}
            {images.length > 1 && (
              <>
                <button className="image-nav prev" onClick={prevImage}>
                  ‹
                </button>
                <button className="image-nav next" onClick={nextImage}>
                  ›
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="image-thumbnails">
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img src={`http://localhost:5000${img}`} alt={`Vue ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Informations */}
        <div className="product-detail-info">
          <div className="product-detail-header">
            <h1>{product.title}</h1>
            <div className="product-detail-price">
              {product.formattedPrice}
            </div>
          </div>

          <div className="product-detail-meta">
            <span className="meta-item">
              <FiTag /> {product.category}
            </span>
            {product.location && (
              <span className="meta-item">
                <FiMapPin /> {product.location}
              </span>
            )}
            <span className="meta-item">
              <FiEye /> {product.views || 0} vues
            </span>
            <span className="meta-item">
              <FiCalendar /> {new Date(product.createdAt).toLocaleDateString('fr-FR')}
            </span>
          </div>

          <div className="product-detail-condition">
            <span className={`condition-badge ${product.condition}`}>
              {product.conditionLabel}
            </span>
          </div>

          <div className="product-detail-description">
            <h3>📝 Description</h3>
            <p>{product.description || 'Aucune description fournie'}</p>
          </div>

          {product.sellerArgs && (
            <div className="product-detail-seller-args">
              <h3>💬 Argument du vendeur</h3>
              <div className="seller-args-box">
                <p>{product.sellerArgs}</p>
              </div>
            </div>
          )}

          <div className="product-detail-seller">
            <h3>👤 Vendeur</h3>
            <div className="seller-info">
              <div className="seller-avatar">
                {product.seller?.name?.charAt(0).toUpperCase() || '?'}
              </div>
              <div className="seller-details">
                <strong>{product.seller?.name || 'Anonyme'}</strong>
              </div>
            </div>
          </div>

          {product.status === 'available' ? (
            <button 
              className="purchase-btn"
              onClick={handlePurchase}
              disabled={isPurchasing || !authViewModel.isAuthenticated}
            >
              <FiShoppingCart />
              {isPurchasing ? 'Achat en cours...' : '🛒 Acheter maintenant'}
            </button>
          ) : (
            <div className="product-sold-badge">
              <span>🔴 Vendu</span>
              <p>Ce produit n'est plus disponible</p>
            </div>
          )}

          {!authViewModel.isAuthenticated && product.status === 'available' && (
            <div className="login-prompt">
              <p>🔐 Connectez-vous pour acheter ce produit</p>
              <button onClick={() => navigate('/login')} className="login-prompt-btn">
                Se connecter
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

export default ProductDetail;