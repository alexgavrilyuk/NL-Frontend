// src/features/subscription/featureFlags.js
import { useContext } from 'react';
import SubscriptionContext from './context/SubscriptionContext';

// Feature definitions with required subscription levels
export const FEATURES = {
  // Basic features
  DATASET_UPLOAD: {
    id: 'dataset_upload',
    requiredPlan: 'basic',
    limits: {
      basic: { maxCount: 5 },
      professional: { maxCount: 20 },
      enterprise: { maxCount: null }, // unlimited
    }
  },

  // Team features
  TEAM_COLLABORATION: {
    id: 'team_collaboration',
    requiredPlan: 'professional',
    limits: {
      professional: { maxMembers: 3 },
      enterprise: { maxMembers: null }, // unlimited
    }
  },

  // Advanced export features
  EXPORT_PDF: {
    id: 'export_pdf',
    requiredPlan: 'professional',
  },

  // Custom visualizations
  CUSTOM_VISUALIZATIONS: {
    id: 'custom_visualizations',
    requiredPlan: 'enterprise',
  },
};

// Plan hierarchy for comparison
const PLAN_HIERARCHY = {
  basic: 1,
  professional: 2,
  enterprise: 3,
};

// Hook to check if a feature is available
export function useFeatureFlag(featureId) {
  const { subscription } = useContext(SubscriptionContext);

  if (!subscription || !subscription.plan) {
    return { isEnabled: false, limits: null, reason: 'No active subscription' };
  }

  const feature = FEATURES[featureId];

  if (!feature) {
    console.warn(`Unknown feature flag: ${featureId}`);
    return { isEnabled: false, limits: null, reason: 'Unknown feature' };
  }

  const currentPlanLevel = PLAN_HIERARCHY[subscription.plan];
  const requiredPlanLevel = PLAN_HIERARCHY[feature.requiredPlan];

  // Check if current plan meets or exceeds required plan
  const isEnabled = currentPlanLevel >= requiredPlanLevel;

  // Get limits for current plan if applicable
  const limits = feature.limits ? feature.limits[subscription.plan] : null;

  // Reason for unavailability
  const reason = isEnabled ? null : `Requires ${feature.requiredPlan} plan or higher`;

  return { isEnabled, limits, reason };
}

// Component wrapper for feature-gated content
export function FeatureGate({ feature, fallback = null, children }) {
  const { isEnabled, reason } = useFeatureFlag(feature);

  if (!isEnabled) {
    return fallback || (
      <div className="feature-gate bg-background-secondary p-4 rounded-md text-center">
        <p className="text-text-primary font-medium">This feature requires an upgrade</p>
        <p className="text-text-secondary text-sm mb-2">{reason}</p>
        <button className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors">
          Upgrade Plan
        </button>
      </div>
    );
  }

  return children;
}