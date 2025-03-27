# Subscription Management Feature

The Subscription Management feature enables users to view, select, and manage subscription plans to access different capabilities within the application.

## Key Components

### Context

- **SubscriptionContext**: Provides state management and operations for subscriptions throughout the application.

### Pages

- **PlansPage**: Displays available subscription plans and allows users to select or change plans.
- **SubscriptionManagementPage**: Manages the current subscription, showing status and providing options to upgrade or cancel.

### Components

- **PlanCard**: Displays an individual subscription plan with features and price.
- **PlanComparison**: Shows a side-by-side comparison of different plans.
- **TrialActivation**: Handles activation of free trials.
- **SubscriptionStatus**: Displays current subscription status with actionable options.
- **UpgradePrompt**: Prompts users to upgrade when trying to access premium features.
- **PlanFeatureList**: Lists features available in a plan.
- **BillingHistory**: Displays billing history for the subscription.

## API Endpoints

The subscription feature interacts with the following backend endpoints:

- `GET /subscription/plans`: Fetch available subscription plans
- `GET /subscription/status`: Fetch current user's subscription status
- `POST /subscription/activate-trial`: Activate a free trial for a plan
- `PUT /subscription/change`: Change subscription plan
- `POST /subscription/cancel`: Cancel the current subscription

## Feature Gating

The subscription feature implements feature gating to control access to premium features based on the user's subscription plan:

- `useFeatureFlag`: Hook to check if a feature is available for the current subscription
- `FeatureGate`: Component to conditionally render content based on subscription level
- `FEATURES`: Configuration object defining feature requirements by subscription level

## Subscription Plans

The application supports three subscription tiers:

1. **Basic Plan**: Essential analytics for small businesses
   - Up to 5 datasets
   - Basic visualizations
   - CSV/Excel imports
   - Email support

2. **Professional Plan**: Advanced analytics for growing businesses
   - Up to 20 datasets
   - Advanced visualizations
   - Team collaboration (up to 3 members)
   - Priority email support
   - Export to PDF/Excel

3. **Enterprise Plan**: Comprehensive analytics for large organizations
   - Unlimited datasets
   - Custom visualizations
   - Team collaboration (unlimited members)
   - Dedicated support
   - Advanced exports
   - Custom integrations

## Integration with Other Features

The Subscription feature integrates with:

- **Dataset Management**: Controls the number of datasets a user can upload
- **Team Management**: Controls the number of team members allowed
- **Reporting**: Controls available export formats and visualization types
- **Prompt Interface**: Controls AI capabilities and complexity

## Implementation Notes

- All subscription-related state is managed through the `SubscriptionContext`
- Feature flags are implemented to conditionally render or enable features based on subscription level
- Trial periods are tracked and displayed to users
- Upgrade prompts are shown when users attempt to access features not included in their plan