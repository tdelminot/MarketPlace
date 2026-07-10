import { makeAutoObservable, runInAction } from 'mobx';
import ApiService from '../services/ApiService';

class StatsViewModel {
  stats = null;
  isLoading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  async loadStats(userId) {
    this.isLoading = true;
    this.error = null;
    try {
      const response = await ApiService.getSellerStats(userId);
      if (response.success) {
        runInAction(() => {
          this.stats = response.stats;
        });
      }
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
}

export default StatsViewModel;
