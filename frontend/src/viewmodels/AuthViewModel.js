
   
import { makeAutoObservable, runInAction } from 'mobx';
import ApiService from '../services/ApiService';
import UserModel from '../models/UserModel';

class AuthViewModel {
  user = null;
  isLoading = false;
  error = null;
  isAuthenticated = false;

  constructor() {
    makeAutoObservable(this);
    this.loadUserFromStorage();
  }

  loadUserFromStorage() {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    console.log('🔍 Chargement depuis storage - Token:', !!token, 'User:', !!userData);
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        this.user = new UserModel(parsedUser);
        this.isAuthenticated = true;
        console.log('✅ Utilisateur chargé:', this.user);
        return true;
      } catch (error) {
        console.error('❌ Erreur chargement:', error);
        this.logout();
        return false;
      }
    }
    return false;
  }

  async register(userData) {
    this.isLoading = true;
    this.error = null;
    try {
      const response = await ApiService.register(userData);
      console.log('📝 Réponse inscription:', response);
      
      if (response.success) {
        const user = new UserModel(response.user);
        ApiService.setAuth(response.token, user);
        runInAction(() => {
          this.user = user;
          this.isAuthenticated = true;
        });
        console.log('✅ Inscription réussie!');
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Erreur inscription:', error);
      runInAction(() => {
        this.error = error.response?.data?.error || error.message;
      });
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async login(email, password) {
    this.isLoading = true;
    this.error = null;
    try {
      const response = await ApiService.login(email, password);
      console.log('🔑 Réponse connexion:', response);
      
      if (response.success) {
        const user = new UserModel(response.user);
        ApiService.setAuth(response.token, user);
        runInAction(() => {
          this.user = user;
          this.isAuthenticated = true;
        });
        console.log('✅ Connexion réussie!');
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Erreur connexion:', error);
      runInAction(() => {
        this.error = error.response?.data?.error || error.message;
      });
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async becomeSeller() {
    if (!this.user) return false;
    try {
      const response = await ApiService.becomeSeller(this.user.id);
      if (response.success) {
        runInAction(() => {
          this.user.isSeller = true;
          localStorage.setItem('user', JSON.stringify(this.user));
        });
        return true;
      }
      return false;
    } catch (error) {
      runInAction(() => {
        this.error = error.response?.data?.error || error.message;
      });
      return false;
    }
  }

  logout() {
    ApiService.setAuth(null, null);
    runInAction(() => {
      this.user = null;
      this.isAuthenticated = false;
    });
    console.log('👋 Déconnexion');
  }
}

// Exporter une instance unique (singleton)
const authViewModel = new AuthViewModel();
export default authViewModel;