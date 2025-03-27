// src/features/subscription/services/subscriptionService.js
import apiClient from '../../shared/api/apiClient';

class SubscriptionService {
  // Get available subscription plans
  getPlans() {
    return apiClient.get('/subscription/plans');
  }

  // Get current user's subscription status
  getSubscriptionStatus() {
    return apiClient.get('/subscription/status');
  }

  // Activate free trial
  activateTrial(planId) {
    return apiClient.post('/subscription/activate-trial', { planId });
  }

  // Change subscription plan
  changePlan(planId) {
    return apiClient.put('/subscription/change', { planId });
  }

  // Cancel subscription
  cancelSubscription() {
    return apiClient.post('/subscription/cancel');
  }
}

export default new SubscriptionService();