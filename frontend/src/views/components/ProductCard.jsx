import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEye, FiMapPin, FiTag } from 'react-icons/fi';

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23667eea'/%3E%3Crect x='50' y='50' width='300' height='300' rx='30' fill='rgba(255,255,255,0.15)'/%3E%3Ctext x='200' y='185' text-anchor='middle' fill='white' font-size='64' font-family='Arial'%3E📸%3C/text%3E%3Ctext x='200' y='250' text-anchor='middle' fill='rgba(255,255,255,0.8)' font-size='20' font-family='Arial'%3EImage non disponible%3C/text%3E%3C/svg%3E";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // Récupérer l'URL de l'image
  const getImageUrl = () => {
    if (product && product.images && product.images.length > 0) {
      const img = product.images[0];
      if (typeof img === 'string' && img.startsWith('/uploads/')) {
        return img;
      }
      return img;
    }
    return PLACEHOLDER_IMAGE;
  };

  const imageUrl = getImageUrl();

  return (
    <motion.div 
      className="product-card"
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="product-image">
        <img 
          src={imageUrl}
          alt={product.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = PLACEHOLDER_IMAGE;
          }}
          loading="lazy"
        />
        {product.status === 'sold' && (
          <div className="product-badge sold">Vendu</div>
        )}
        <div className="product-views">
          <FiEye size={14} /> {product.views || 0}
        </div>
      </div>

      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-price">{product.formattedPrice}</p>
        
        <div className="product-meta">
          <span className="product-condition">{product.conditionLabel}</span>
          {product.location && (
            <span className="product-location">
              <FiMapPin size={12} /> {product.location}
            </span>
          )}
        </div>

        <div className="product-footer">
          <span className="product-seller">
            {product.seller?.name || 'Vendeur'}
          </span>
          <span className="product-category">
            <FiTag size={12} /> {product.category}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;