// src/features/account/index.js

// Components
export { default as ProfileForm } from './components/ProfileForm';
export { default as SettingsForm } from './components/SettingsForm';
export { default as AIContextForm } from './components/AIContextForm';
export { default as ThemeSelector } from './components/ThemeSelector';
export { default as SecuritySettings } from './components/SecuritySettings';

// Pages
export { default as ProfilePage } from './pages/ProfilePage';
export { default as SettingsPage } from './pages/SettingsPage';

// Context
export { AccountProvider, useAccount as useAccountContext } from './context/AccountContext';

// Hooks
export { default as useAccount } from './hooks/useAccount';

// Utilities
export { default as accountUtils } from './accountUtils';