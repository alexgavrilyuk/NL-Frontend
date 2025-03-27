// src/features/account/hooks/useAccount.js

import { useState, useCallback } from 'react';
import { useAccount as useAccountContext } from '../context/AccountContext';

// This hook extends the context with additional functionality
export function useAccount() {
  const accountContext = useAccountContext();
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  // Export profile and onboarding data
  const exportProfileData = useCallback(async () => {
    setLocalLoading(true);
    setLocalError(null);

    try {
      // Get combined profile data
      const profileData = {
        ...accountContext.profile,
        settings: accountContext.settings,
        preferences: accountContext.preferences
      };

      // Create a JSON blob
      const blob = new Blob([JSON.stringify(profileData, null, 2)], { type: 'application/json' });

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = `neuroledger-profile-${new Date().toISOString().slice(0, 10)}.json`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      setLocalError(error);
      return false;
    } finally {
      setLocalLoading(false);
    }
  }, [accountContext.profile, accountContext.settings, accountContext.preferences]);

  return {
    ...accountContext,
    exportProfileData,
    localLoading,
    localError
  };
}

export default useAccount;