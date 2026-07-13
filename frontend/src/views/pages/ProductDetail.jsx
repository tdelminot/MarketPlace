 
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import { FiMapPin, FiTag, FiEye, FiArrowLeft, FiCalendar, FiShoppingCart } from 'react-icons/fi';
import toast from 'react-hot-toast';
import authViewModel from '../../viewmodels/AuthViewModel';
import ProductViewModel from '../../viewmodels/ProductViewModel';
console.log(' PRODUCTDETAIL CHARGÉ - VERSION 2.0 - 2026-07-13 11:30 ');


// Utiliser l'URL de l'API depuis VITE_API_URL
const API_BASE_URL = 'https://marketplace-acqr.onrender.com/api';
const PLACEHOLDER_IMAGE = '/images/placeholder.svg';

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

  //  Fonction pour obtenir l'URL de l'image (supporte Cloudinary et local)
  const getImageUrl = (image) => {
    if (!image) return PLACEHOLDER_IMAGE;
    
    // Si c'est déjà une URL complète (Cloudinary), la garder
    if (typeof image === 'string' && (image.startsWith('http://') || image.startsWith('https://'))) {
      return `${image}?v=2`;
    }
    
    // Si c'est un chemin local, utiliser l'URL de l'API
    if (typeof image === 'string' && image.startsWith('/uploads/')) {
      // Utiliser l'URL de l'API (Render en prod, localhost en dev)
      return `${API_BASE_URL.replace('/api', '')}${image}`;
    }
    
    return PLACEHOLDER_IMAGE;
  };

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
      <div className="error-container" style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: '#EF4444' }}>Produit non trouvé</p>
        <button 
          onClick={() => navigate('/')}
          style={{
            background: '#6B21A5',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1.5rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  const images = product.images || [];
  const currentImage = getImageUrl(images[currentImageIndex] || images[0]);

  return (
    <motion.div 
      className="product-detail-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}
    >
      <button 
        className="back-button" 
        onClick={() => navigate('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'transparent',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          padding: '0.5rem 0',
          marginBottom: '1.5rem',
          fontSize: '1rem'
        }}
      >
        <FiArrowLeft /> Retour
      </button>

      <div className="product-detail-grid" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2.5rem'
      }}>
        {/* Images */}
        <div className="product-detail-images" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div className="main-image" style={{
            position: 'relative',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '1rem',
            overflow: 'hidden',
            aspectRatio: '1/1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1e293b'
          }}>
            <img 
              src={currentImage} 
              alt={product.title}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                display: 'block'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = PLACEHOLDER_IMAGE;
              }}
            />
            {product.status === 'sold' && (
              <div className="product-badge sold" style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                background: '#EF4444',
                padding: '0.3rem 1rem',
                borderRadius: '2rem',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                color: 'white'
              }}>
                Vendu
              </div>
            )}
            {images.length > 1 && (
              <>
                <button 
                  className="image-nav prev" 
                  onClick={prevImage}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,0.7)',
                    border: 'none',
                    color: 'white',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    left: '0.5rem',
                    fontSize: '1.5rem'
                  }}
                >
                  ‹
                </button>
                <button 
                  className="image-nav next" 
                  onClick={nextImage}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,0.7)',
                    border: 'none',
                    color: 'white',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    right: '0.5rem',
                    fontSize: '1.5rem'
                  }}
                >
                  ›
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="image-thumbnails" style={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}>
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: index === currentImageIndex ? '2px solid #F59E0B' : '2px solid transparent'
                  }}
                >
                  <img 
                    src={getImageUrl(img)}
                    alt={`Vue ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Informations */}
        <div className="product-detail-info">
          <div className="product-detail-header">
            <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{product.title}</h1>
            <div className="product-detail-price" style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#F59E0B'
            }}>
              {product.formattedPrice}
            </div>
          </div>

          <div className="product-detail-meta" style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            margin: '1rem 0',
            color: '#6B7280'
          }}>
            <span className="meta-item" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <FiTag /> {product.category}
            </span>
            {product.location && (
              <span className="meta-item" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <FiMapPin /> {product.location}
              </span>
            )}
            <span className="meta-item" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <FiEye /> {product.views || 0} vues
            </span>
            <span className="meta-item" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <FiCalendar /> {new Date(product.createdAt).toLocaleDateString('fr-FR')}
            </span>
          </div>

          <div className="product-detail-condition">
            <span className={`condition-badge ${product.condition}`} style={{
              padding: '0.3rem 1rem',
              borderRadius: '2rem',
              fontSize: '0.8rem',
              background: product.condition === 'new' ? '#10B981' : 
                          product.condition === 'like-new' ? '#3B82F6' : 
                          product.condition === 'good' ? '#F59E0B' : '#6B7280',
              color: 'white'
            }}>
              {product.conditionLabel}
            </span>
          </div>

          <div className="product-detail-description" style={{ margin: '1.5rem 0' }}>
            <h3 style={{ color: '#6B7280', marginBottom: '0.5rem', fontSize: '1rem' }}>📝 Description</h3>
            <p style={{ color: 'white', lineHeight: '1.6' }}>{product.description || 'Aucune description fournie'}</p>
          </div>

          {product.sellerArgs && (
            <div className="product-detail-seller-args" style={{ margin: '1.5rem 0' }}>
              <h3 style={{ color: '#6B7280', marginBottom: '0.5rem', fontSize: '1rem' }}>💬 Argument du vendeur</h3>
              <div className="seller-args-box" style={{
                background: 'rgba(255,215,0,0.05)',
                padding: '1rem',
                borderRadius: '0.5rem',
                borderLeft: '3px solid #F59E0B',
                fontStyle: 'italic'
              }}>
                <p>{product.sellerArgs}</p>
              </div>
            </div>
          )}

          <div className="product-detail-seller" style={{ margin: '1.5rem 0' }}>
            <h3 style={{ color: '#6B7280', marginBottom: '0.5rem', fontSize: '1rem' }}>👤 Vendeur</h3>
            <div className="seller-info" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="seller-avatar" style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: '#6B21A5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'white'
              }}>
                {product.seller?.name?.charAt(0).toUpperCase() || '?'}
              </div>
              <div className="seller-details" style={{ display: 'flex', flexDirection: 'column' }}>
                <strong style={{ color: 'white' }}>{product.seller?.name || 'Anonyme'}</strong>
              </div>
            </div>
          </div>

          {product.status === 'available' ? (
            <button 
              className="purchase-btn"
              onClick={handlePurchase}
              disabled={isPurchasing || !authViewModel.isAuthenticated}
              style={{
                width: '100%',
                padding: '1rem',
                background: '#10B981',
                color: 'white',
                border: 'none',
                borderRadius: '0.8rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '1rem',
                opacity: (isPurchasing || !authViewModel.isAuthenticated) ? 0.6 : 1
              }}
            >
              <FiShoppingCart />
              {isPurchasing ? 'Achat en cours...' : '🛒 Acheter maintenant'}
            </button>
          ) : (
            <div className="product-sold-badge" style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '2px solid #EF4444',
              padding: '1rem',
              borderRadius: '0.8rem',
              textAlign: 'center',
              marginTop: '1rem'
            }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#EF4444' }}>🔴 Vendu</span>
              <p style={{ color: '#6B7280' }}>Ce produit n'est plus disponible</p>
            </div>
          )}

          {!authViewModel.isAuthenticated && product.status === 'available' && (
            <div className="login-prompt" style={{
              background: 'rgba(255,255,255,0.05)',
              padding: '1rem',
              borderRadius: '0.8rem',
              textAlign: 'center',
              marginTop: '1rem'
            }}>
              <p style={{ color: '#6B7280' }}>🔐 Connectez-vous pour acheter ce produit</p>
              <button 
                onClick={() => navigate('/login')} 
                className="login-prompt-btn"
                style={{
                  background: '#6B21A5',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  marginTop: '0.5rem'
                }}
              >
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