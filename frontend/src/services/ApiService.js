import axios from 'axios';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Intercepteur pour ajouter le token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Intercepteur pour les erreurs
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth
  async register(userData) {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async login(email, password) {
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
  }

  async becomeSeller(userId) {
    const response = await this.api.put(`/auth/become-seller/${userId}`);
    return response.data;
  }

  // Products
  async getProducts(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    const response = await this.api.get(`/products?${params.toString()}`);
    return response.data;
  }

  async getProduct(id) {
    const response = await this.api.get(`/products/${id}`);
    return response.data;
  }

  async createProduct(productData) {
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
      if (key === 'images') {
        productData.images.forEach(file => {
          formData.append('images', file);
        });
      } else {
        formData.append(key, productData[key]);
      }
    });
    
    const response = await this.api.post('/products/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async purchaseProduct(productId) {
    const response = await this.api.post(`/products/${productId}/purchase`);
    return response.data;
  }

  async deleteProduct(id) {
    const response = await this.api.delete(`/products/${id}`);
    return response.data;
  }

  // Stats
  async getSellerStats(userId) {
    const response = await this.api.get(`/stats/seller/${userId}`);
    return response.data;
  }

  // Helper: Set auth
  setAuth(token, user) {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new ApiService();