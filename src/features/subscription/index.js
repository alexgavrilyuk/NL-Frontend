// src/features/subscription/index.js
// Components
export { default as PlanCard } from './components/PlanCard';
export { default as PlanComparison } from './components/PlanComparison';
export { default as TrialActivation } from './components/TrialActivation';
export { default as SubscriptionStatus } from './components/SubscriptionStatus';
export { default as UpgradePrompt } from './components/UpgradePrompt';
export { default as PlanFeatureList } from './components/PlanFeatureList';
export { default as BillingHistory } from './components/BillingHistory';

// Pages
export { default as PlansPage } from './pages/PlansPage';
export { default as SubscriptionManagementPage } from './pages/SubscriptionManagementPage';

// Hooks
export { useFeatureFlag, FeatureGate } from './featureFlags';
export { useSubscription } from './context/SubscriptionContext';

// Context
export { SubscriptionProvider } from './context/SubscriptionContext';

// Utilities
export { FEATURES } from './featureFlags';