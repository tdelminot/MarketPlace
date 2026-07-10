import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import authViewModel from '../../viewmodels/AuthViewModel';

const RegisterPage = observer(() => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Rediriger si déjà connecté
  useEffect(() => {
    console.log('🔍 RegisterPage - isAuthenticated:', authViewModel.isAuthenticated);
    if (authViewModel.isAuthenticated) {
      navigate('/');
    }
  }, [authViewModel.isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    const success = await authViewModel.register(formData);
    setIsSubmitting(false);
    
    if (success) {
      console.log('✅ Inscription réussie, redirection vers /');
      navigate('/');
    } else {
      setError(authViewModel.error || 'Erreur d\'inscription');
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>📝 Inscription</h2>
        
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Mot de passe *</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Nom complet</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Téléphone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <button 
            type="submit" 
            className="auth-btn"
            disabled={authViewModel.isLoading || isSubmitting}
          >
            {authViewModel.isLoading ? 'Inscription...' : 'S\'inscrire'}
          </button>
        </form>

        <p className="auth-link">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </motion.div>
    </div>
  );
});

export default RegisterPage;