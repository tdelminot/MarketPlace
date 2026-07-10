import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import authViewModel from '../../viewmodels/AuthViewModel';

const LoginPage = observer(() => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Rediriger si déjà connecté
  useEffect(() => {
    console.log('🔍 LoginPage - isAuthenticated:', authViewModel.isAuthenticated);
    if (authViewModel.isAuthenticated) {
      navigate('/');
    }
  }, [authViewModel.isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    const success = await authViewModel.login(formData.email, formData.password);
    setIsSubmitting(false);
    
    if (success) {
      console.log('✅ Connexion réussie, redirection vers /');
      navigate('/');
    } else {
      setError(authViewModel.error || 'Erreur de connexion');
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>🔐 Connexion</h2>
        
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button 
            type="submit" 
            className="auth-btn"
            disabled={authViewModel.isLoading || isSubmitting}
          >
            {authViewModel.isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="auth-link">
          Pas encore de compte ? <Link to="/register">S'inscrire</Link>
        </p>
      </motion.div>
    </div>
  );
});

export default LoginPage;