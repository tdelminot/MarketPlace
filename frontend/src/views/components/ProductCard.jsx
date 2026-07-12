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
      style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '1rem',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      {/* Conteneur d'image avec styles inline forcés */}
      <div 
        className="product-image"
        style={{
          width: '100%',
          height: '220px',
          overflow: 'hidden',
          backgroundColor: '#1e293b',
          position: 'relative',
          display: 'block',
          flexShrink: 0
        }}
      >
        <img 
          src={imageUrl}
          alt={product.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            margin: 0,
            padding: 0
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = PLACEHOLDER_IMAGE;
          }}
          loading="lazy"
        />
        {product.status === 'sold' && (
          <div 
            className="product-badge sold"
            style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              background: '#EF4444',
              padding: '0.3rem 1rem',
              borderRadius: '2rem',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              color: 'white'
            }}
          >
            Vendu
          </div>
        )}
        <div 
          className="product-views"
          style={{
            position: 'absolute',
            bottom: '0.5rem',
            right: '0.5rem',
            background: 'rgba(0,0,0,0.7)',
            padding: '0.2rem 0.6rem',
            borderRadius: '1rem',
            fontSize: '0.7rem',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <FiEye size={14} /> {product.views || 0}
        </div>
      </div>

      {/* Informations du produit */}
      <div 
        className="product-info"
        style={{
          padding: '1rem',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <h3 
          className="product-title"
          style={{
            fontSize: '1rem',
            margin: '0 0 0.3rem 0',
            color: 'white',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {product.title}
        </h3>
        <p 
          className="product-price"
          style={{
            fontSize: '1.3rem',
            fontWeight: 'bold',
            color: '#F59E0B',
            margin: '0 0 0.5rem 0'
          }}
        >
          {product.formattedPrice}
        </p>
        
        <div 
          className="product-meta"
          style={{
            display: 'flex',
            gap: '0.5rem',
            margin: '0 0 0.5rem 0',
            fontSize: '0.8rem',
            color: '#6B7280'
          }}
        >
          <span className="product-condition">{product.conditionLabel}</span>
          {product.location && (
            <span className="product-location" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FiMapPin size={12} /> {product.location}
            </span>
          )}
        </div>

        <div 
          className="product-footer"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: '#6B7280',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            paddingTop: '0.5rem',
            marginTop: 'auto'
          }}
        >
          <span className="product-seller">
            {product.seller?.name || 'Vendeur'}
          </span>
          <span className="product-category" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FiTag size={12} /> {product.category}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;