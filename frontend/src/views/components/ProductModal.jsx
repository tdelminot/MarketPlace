import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight, FiMapPin, FiTag, FiEye } from 'react-icons/fi';

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23667eea'/%3E%3Crect x='50' y='50' width='300' height='300' rx='30' fill='rgba(255,255,255,0.15)'/%3E%3Ctext x='200' y='185' text-anchor='middle' fill='white' font-size='64' font-family='Arial'%3E📸%3C/text%3E%3Ctext x='200' y='250' text-anchor='middle' fill='rgba(255,255,255,0.8)' font-size='20' font-family='Arial'%3EImage non disponible%3C/text%3E%3C/svg%3E";

const ProductModal = ({ product, onClose, onPurchase }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPurchasing, setIsPurchasing] = useState(false);

  if (!product) return null;

  const images = product.images || [];
  const currentImage = images[currentImageIndex] 
    ? `http://localhost:5000${images[currentImageIndex]}`
    : PLACEHOLDER_IMAGE;

  const handlePurchase = async () => {
    setIsPurchasing(true);
    await onPurchase(product.id);
    setIsPurchasing(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="modal-content"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal-close" onClick={onClose}>
            <FiX size={24} />
          </button>

          <div className="modal-body">
            <div className="modal-image-section">
              <img 
                src={currentImage} 
                alt={product.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = PLACEHOLDER_IMAGE;
                }}
              />
              {images.length > 1 && (
                <>
                  <button className="modal-nav prev" onClick={prevImage}>
                    <FiChevronLeft />
                  </button>
                  <button className="modal-nav next" onClick={nextImage}>
                    <FiChevronRight />
                  </button>
                  <div className="image-counter">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            <div className="modal-info">
              <h2>{product.title}</h2>
              <p className="modal-price">{product.formattedPrice}</p>
              
              <div className="modal-meta">
                <span className="modal-condition">{product.conditionLabel}</span>
                {product.location && (
                  <span><FiMapPin size={14} /> {product.location}</span>
                )}
                <span><FiTag size={14} /> {product.category}</span>
                <span><FiEye size={14} /> {product.views || 0} vues</span>
              </div>

              <div className="modal-description">
                <h4>Description</h4>
                <p>{product.description || 'Aucune description'}</p>
              </div>

              {product.sellerArgs && (
                <div className="modal-seller-args">
                  <h4>💬 Argument du vendeur</h4>
                  <p className="seller-args">{product.sellerArgs}</p>
                </div>
              )}

              <div className="modal-seller">
                <h4>Vendeur</h4>
                <p>{product.seller?.name || product.seller?.username || 'Anonyme'}</p>
              </div>

              {product.status === 'available' ? (
                <button 
                  className="modal-buy-btn"
                  onClick={handlePurchase}
                  disabled={isPurchasing}
                >
                  {isPurchasing ? 'Achat en cours...' : '🛒 Acheter maintenant'}
                </button>
              ) : (
                <div className="modal-sold-badge">Vendu</div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductModal;
