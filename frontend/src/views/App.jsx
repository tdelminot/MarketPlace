 
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { observer } from 'mobx-react-lite';
import authViewModel from '../viewmodels/AuthViewModel';
import ProductViewModel from '../viewmodels/ProductViewModel';
import StatsViewModel from '../viewmodels/StatsViewModel';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SellPage from './pages/SellPage';
import DashboardPage from './pages/DashboardPage';
import ProductDetail from './pages/ProductDetail';
import '../styles/App.css';

// Créer les instances des ViewModels
const productViewModel = new ProductViewModel();
const statsViewModel = new StatsViewModel();

const App = observer(() => {
  const user = authViewModel.user;
  const isAuthenticated = authViewModel.isAuthenticated;

  console.log('🔄 App - isAuthenticated:', isAuthenticated, 'User:', user);

  // Recharger l'état depuis le storage à chaque rendu
  useEffect(() => {
    authViewModel.loadUserFromStorage();
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      
      <nav className="navbar">
        <Link to="/" className="nav-brand">🛒 MarketPlace</Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Accueil</Link>
          {isAuthenticated ? (
            <>
              <Link to="/sell" className="nav-link">Vendre</Link>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <span className="nav-user">👤 {user?.fullName || user?.email}</span>
              <button 
                className="nav-logout"
                onClick={() => {
                  authViewModel.logout();
                  window.location.href = '/';
                }}
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Connexion</Link>
              <Link to="/register" className="nav-link register">Inscription</Link>
            </>
          )}
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                authViewModel={authViewModel}
                productViewModel={productViewModel}
              />
            } 
          />
          <Route 
            path="/login" 
            element={
              <LoginPage authViewModel={authViewModel} />
            } 
          />
          <Route 
            path="/register" 
            element={
              <RegisterPage authViewModel={authViewModel} />
            } 
          />
          <Route 
            path="/sell" 
            element={
              isAuthenticated ? 
              <SellPage 
                authViewModel={authViewModel}
                productViewModel={productViewModel}
              /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
              <DashboardPage 
                authViewModel={authViewModel}
                productViewModel={productViewModel}
                statsViewModel={statsViewModel}
              /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/product/:id" 
            element={
              <ProductDetail 
                authViewModel={authViewModel}
                productViewModel={productViewModel}
              />
            } 
          />
        </Routes>
      </main>

      <footer className="footer">
        <p>🛒 MarketPlace - Vente entre particuliers © 2024</p>
      </footer>
    </BrowserRouter>
  );
});

export default App;