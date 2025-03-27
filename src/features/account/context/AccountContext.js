// src/features/account/context/AccountContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import accountService from '../services/accountService';
import { useAuth } from '../../auth/context/AuthContext';

// Create context
const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user profile, settings, and preferences on mount or when user changes
  useEffect(() => {
    const loadUserData = async () => {
      if (!currentUser) {
        setProfile(null);
        setSettings(null);
        setPreferences(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch user profile
        const profileResponse = await accountService.getProfile();
        setProfile(profileResponse.data.profile);

        // Fetch user settings
        const settingsResponse = await accountService.getSettings();
        setSettings(settingsResponse.data.settings);

        // Fetch user preferences
        const preferencesResponse = await accountService.getPreferences();
        setPreferences(preferencesResponse.data.preferences);
      } catch (err) {
        console.error('Error loading user data:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [currentUser]);

  // Update profile
  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const response = await accountService.updateProfile(profileData);
      setProfile(response.data.profile);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update settings
  const updateSettings = async (settingsData) => {
    setLoading(true);
    try {
      const response = await accountService.updateSettings(settingsData);
      setSettings(response.data.settings);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update preferences
  const updatePreferences = async (preferencesData) => {
    setLoading(true);
    try {
      const response = await accountService.updatePreferences(preferencesData);
      setPreferences(response.data.preferences);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update onboarding status
  const updateOnboarding = async (onboardingData) => {
    setLoading(true);
    try {
      const response = await accountService.updateOnboarding(onboardingData);
      setProfile({
        ...profile,
        onboarding: response.data.onboarding
      });
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    profile,
    settings,
    preferences,
    loading,
    error,
    updateProfile,
    updateSettings,
    updatePreferences,
    updateOnboarding,
    clearError
  };

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  );
};

// Custom hook to use account context
export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};