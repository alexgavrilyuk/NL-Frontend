// src/features/subscription/context/SubscriptionContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import subscriptionService from '../services/subscriptionService';
import { useAuth } from '../../auth/context/AuthContext';

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);

  // Load subscription data when user is authenticated
  useEffect(() => {
    if (currentUser) {
      fetchSubscriptionStatus();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [currentUser]);

  // Load available plans on mount
  useEffect(() => {
    fetchPlans();
  }, []);

  // Fetch subscription status
  const fetchSubscriptionStatus = async () => {
    setLoading(true);
    try {
      const response = await subscriptionService.getSubscriptionStatus();
      setSubscription(response.data.data.subscription);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch subscription status');
      console.error('Error fetching subscription status:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available plans
  const fetchPlans = async () => {
    try {
      const response = await subscriptionService.getPlans();
      setPlans(response.data.data.plans);
    } catch (err) {
      console.error('Error fetching plans:', err);
    }
  };

  // Activate trial
  const activateTrial = async (planId) => {
    setLoading(true);
    try {
      const response = await subscriptionService.activateTrial(planId);
      setSubscription(response.data.data.subscription);
      return response.data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Change subscription plan
  const changePlan = async (planId) => {
    setLoading(true);
    try {
      const response = await subscriptionService.changePlan(planId);
      setSubscription(response.data.data.subscription);
      return response.data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancel subscription
  const cancelSubscription = async () => {
    setLoading(true);
    try {
      const response = await subscriptionService.cancelSubscription();
      setSubscription(response.data.data.subscription);
      return response.data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    subscription,
    loading,
    error,
    plans,
    activateTrial,
    changePlan,
    cancelSubscription,
    refreshSubscription: fetchSubscriptionStatus
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export default SubscriptionContext;