// src/features/account/services/accountService.js

import apiClient from '../../shared/api/apiClient';

class AccountService {
  // Get user profile
  async getProfile() {
    return apiClient.get('/account/profile');
  }

  // Update user profile
  async updateProfile(profileData) {
    return apiClient.put('/account/profile', profileData);
  }

  // Get user settings
  async getSettings() {
    return apiClient.get('/account/settings');
  }

  // Update user settings
  async updateSettings(settingsData) {
    return apiClient.put('/account/settings', settingsData);
  }

  // Get AI context preferences
  async getPreferences() {
    return apiClient.get('/account/preferences');
  }

  // Update AI context preferences
  async updatePreferences(preferencesData) {
    return apiClient.put('/account/preferences', preferencesData);
  }

  // Get onboarding status
  async getOnboarding() {
    return apiClient.get('/account/onboarding');
  }

  // Update onboarding status
  async updateOnboarding(onboardingData) {
    return apiClient.put('/account/onboarding', onboardingData);
  }
}

export default new AccountService();