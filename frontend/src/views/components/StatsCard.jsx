import React from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiDollarSign, FiEye, FiTrendingUp } from 'react-icons/fi';

const StatsCard = ({ stats }) => {
  if (!stats) return null;

  const statItems = [
    { 
      icon: <FiPackage size={24} />, 
      label: 'Produits actifs', 
      value: stats.activeProducts || 0,
      color: '#4CAF50'
    },
    { 
      icon: <FiDollarSign size={24} />, 
      label: 'Revenus totaux', 
      value: `${stats.totalRevenue || 0}€`,
      color: '#FFD700'
    },
    { 
      icon: <FiEye size={24} />, 
      label: 'Vues totales', 
      value: stats.totalViews || 0,
      color: '#2196F3'
    },
    { 
      icon: <FiTrendingUp size={24} />, 
      label: 'Taux de conversion', 
      value: `${stats.conversionRate || 0}%`,
      color: '#FF6B6B'
    }
  ];

  return (
    <div className="stats-grid">
      {statItems.map((item, index) => (
        <motion.div 
          key={index}
          className="stats-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          style={{ borderColor: item.color }}
        >
          <div className="stats-icon" style={{ color: item.color }}>
            {item.icon}
          </div>
          <div className="stats-info">
            <span className="stats-value">{item.value}</span>
            <span className="stats-label">{item.label}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCard;