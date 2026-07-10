import { makeAutoObservable, runInAction } from 'mobx';
import ApiService from '../services/ApiService';
import ProductModel from '../models/ProductModel';

class ProductViewModel {
  products = [];
  selectedProduct = null;
  isLoading = false;
  error = null;
  total = 0;

  constructor() {
    makeAutoObservable(this);
  }

  async loadProducts(filters = {}) {
    this.isLoading = true;
    this.error = null;
    try {
      const response = await ApiService.getProducts(filters);
      runInAction(() => {
        // Utiliser 'new' pour créer des instances
        this.products = response.products.map(p => new ProductModel(p));
        this.total = response.count || response.products.length;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.response?.data?.error || error.message;
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async loadProduct(id) {
    this.isLoading = true;
    this.error = null;
    try {
      const response = await ApiService.getProduct(id);
      if (response.success) {
        runInAction(() => {
          // Utiliser 'new' pour créer une instance
          this.selectedProduct = new ProductModel(response.product);
        });
        return this.selectedProduct;
      }
      return null;
    } catch (error) {
      runInAction(() => {
        this.error = error.response?.data?.error || error.message;
      });
      return null;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async createProduct(productData) {
    this.isLoading = true;
    this.error = null;
    try {
      const response = await ApiService.createProduct(productData);
      if (response.success) {
        const product = new ProductModel(response.product);
        runInAction(() => {
          this.products.unshift(product);
        });
        return product;
      }
      return null;
    } catch (error) {
      runInAction(() => {
        this.error = error.response?.data?.error || error.message;
      });
      return null;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async purchaseProduct(productId) {
    this.isLoading = true;
    this.error = null;
    try {
      const response = await ApiService.purchaseProduct(productId);
      if (response.success) {
        runInAction(() => {
          const product = this.products.find(p => p.id === productId);
          if (product) {
            product.status = 'sold';
          }
          if (this.selectedProduct && this.selectedProduct.id === productId) {
            this.selectedProduct.status = 'sold';
          }
        });
        return response.transaction;
      }
      return null;
    } catch (error) {
      runInAction(() => {
        this.error = error.response?.data?.error || error.message;
      });
      return null;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async deleteProduct(productId) {
    this.isLoading = true;
    this.error = null;
    try {
      const response = await ApiService.deleteProduct(productId);
      if (response.success) {
        runInAction(() => {
          this.products = this.products.filter(p => p.id !== productId);
          if (this.selectedProduct && this.selectedProduct.id === productId) {
            this.selectedProduct = null;
          }
        });
        return true;
      }
      return false;
    } catch (error) {
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

  clearSelected() {
    this.selectedProduct = null;
  }
}

export default ProductViewModel;
