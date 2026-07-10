import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import authViewModel from '../../viewmodels/AuthViewModel';
import ProductViewModel from '../../viewmodels/ProductViewModel';

const productViewModel = new ProductViewModel();

const SellPage = observer(() => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sellerArgs: '',
    price: '',
    category: 'other',
    condition: 'good',
    location: '',
    images: []
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authViewModel.isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Vérifier si l'utilisateur est vendeur
    if (!authViewModel.user?.isSeller) {
      toast.info('Devenez vendeur pour publier des annonces');
    }
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!authViewModel.isAuthenticated) {
      toast.error('Veuillez vous connecter');
      navigate('/login');
      return;
    }

    if (!authViewModel.user?.isSeller) {
      const confirm = window.confirm('Vous n\'êtes pas encore vendeur. Voulez-vous devenir vendeur maintenant ?');
      if (confirm) {
        const success = await authViewModel.becomeSeller();
        if (!success) {
          toast.error('Erreur lors de l\'activation du compte vendeur');
          return;
        }
        toast.success('✅ Vous êtes maintenant vendeur !');
      } else {
        return;
      }
    }

    setIsSubmitting(true);
    try {
      console.log('📤 Publication du produit:', formData);
      
      const product = await productViewModel.createProduct({
        ...formData,
        price: parseFloat(formData.price)
      });

      if (product) {
        toast.success('✅ Produit publié avec succès !');
        navigate('/');
      } else {
        toast.error(productViewModel.error || 'Erreur lors de la publication');
      }
    } catch (error) {
      console.error('❌ Erreur publication:', error);
      toast.error('Erreur lors de la publication');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!authViewModel.isAuthenticated) {
    return null;
  }

  return (
    <div className="sell-container">
      <motion.div 
        className="sell-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>📤 Vendre un produit</h2>
        <p>
          {authViewModel.user?.isSeller 
            ? 'Remplissez tous les champs pour publier votre annonce' 
            : '🔑 Devenez vendeur pour publier vos annonces'}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Titre *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Ex: iPhone 13 Pro 256GB"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Décrivez votre produit en détail..."
            />
          </div>

          <div className="form-group">
            <label>💬 Argumentaire vendeur</label>
            <textarea
              rows="3"
              placeholder="Pourquoi acheter chez vous ? Quels sont les points forts du produit ?"
              value={formData.sellerArgs}
              onChange={(e) => setFormData({ ...formData, sellerArgs: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Prix (€) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label>Catégorie</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="electronics">Électronique</option>
                <option value="clothing">Vêtements</option>
                <option value="books">Livres</option>
                <option value="sport">Sport</option>
                <option value="music">Musique</option>
                <option value="other">Autre</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>État</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              >
                <option value="new">Neuf</option>
                <option value="like-new">Comme neuf</option>
                <option value="good">Bon état</option>
                <option value="fair">Correct</option>
              </select>
            </div>

            <div className="form-group">
              <label>Localisation</label>
              <input
                type="text"
                placeholder="Ville, pays"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Images (max 5)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
            {imagePreviews.length > 0 && (
              <div className="image-previews">
                {imagePreviews.map((preview, index) => (
                  <img key={index} src={preview} alt={`Preview ${index}`} />
                ))}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="sell-btn"
            disabled={isSubmitting || !authViewModel.user?.isSeller}
          >
            {isSubmitting ? 'Publication...' : '📤 Publier l\'annonce'}
          </button>
          
          {!authViewModel.user?.isSeller && (
            <p style={{ color: '#F59E0B', marginTop: '10px', textAlign: 'center' }}>
              🔑 Devenez vendeur pour publier des annonces
            </p>
          )}
        </form>
      </motion.div>
    </div>
  );
});

export default SellPage;