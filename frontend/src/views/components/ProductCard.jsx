 
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEye, FiMapPin, FiTag } from 'react-icons/fi';

// Utiliser une image statique dans le dossier public
const PLACEHOLDER_IMAGE = '/images/placeholder.svg';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // Récupérer l'URL de l'image
  const getImageUrl = () => {
    if (product && product.images && product.images.length > 0) {
      const img = product.images[0];
      // Si c'est une URL Cloudinary ou un chemin valide, la garder
      if (typeof img === 'string' && (img.startsWith('http') || img.startsWith('/uploads/'))) {
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