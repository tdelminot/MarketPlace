 
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEye, FiMapPin, FiTag } from 'react-icons/fi';

// Placeholder plus leger
const PLACEHOLDER_IMAGE = '/images/placeholder.svg';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // Récupérer l'URL de l'image
  const getImageUrl = () => {
    if (!product || !product.images || product.images.length === 0) {
      return PLACEHOLDER_IMAGE;
    }
    
    const img = product.images[0];
    
    // Si c'est une URL Cloudinary ou une URL complète, la garder
    if (typeof img === 'string' && (img.startsWith('http://') || img.startsWith('https://'))) {
      return img;
    }
    
    // Si c'est un chemin local, le garder (pour le développement)
    if (typeof img === 'string' && img.startsWith('/uploads/')) {
      return img;
    }
    
    // Sinon, placeholder
    return PLACEHOLDER_IMAGE;
  };

  const imageUrl = getImageUrl();

  return (
    <motion.div 
      className="product-card"
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      onClick={() => navigate(`/product/${product.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="product-image" style={{ position: 'relative', overflow: 'hidden' }}>
        <img 
          src={imageUrl}
          alt={product.title || 'Produit'}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = PLACEHOLDER_IMAGE;
          }}
          loading="lazy"
          style={{ 
            width: '100%', 
            height: '200px', 
            objectFit: 'cover',
            backgroundColor: '#f0f0f0'
          }}
        />
        {product.status === 'sold' && (
          <div className="product-badge sold" style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'red',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            Vendu
          </div>
        )}
        <div className="product-views" style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          background: 'rgba(0,0,0,0.6)',
          color: 'white',
          padding: '4px 10px',
          borderRadius: '12px',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <FiEye size={14} /> {product.views || 0}
        </div>
      </div>

      <div className="product-info" style={{ padding: '12px 16px' }}>
        <h3 className="product-title" style={{
          fontSize: '16px',
          fontWeight: '600',
          margin: '0 0 8px 0',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {product.title || 'Sans titre'}
        </h3>
        <p className="product-price" style={{
          fontSize: '18px',
          fontWeight: '700',
          color: '#2563eb',
          margin: '0 0 8px 0'
        }}>
          {product.formattedPrice || `${product.price} €`}
        </p>
        
        <div className="product-meta" style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '13px',
          color: '#666',
          marginBottom: '8px'
        }}>
          <span className="product-condition">
            {product.conditionLabel || product.condition || 'Bon état'}
          </span>
          {product.location && (
            <span className="product-location">
              <FiMapPin size={12} /> {product.location}
            </span>
          )}
        </div>

        <div className="product-footer" style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#999',
          borderTop: '1px solid #eee',
          paddingTop: '8px'
        }}>
          <span className="product-seller">
            {product.seller?.name || 'Vendeur'}
          </span>
          <span className="product-category">
            <FiTag size={12} /> {product.category || 'Autre'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;