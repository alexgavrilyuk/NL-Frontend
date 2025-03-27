// src/features/account/pages/ProfilePage.js

import React, { useState } from 'react';
import { useAccount } from '../context/AccountContext';
import { useAuth } from '../../auth/context/AuthContext';
import PageHeader from '../../shared/ui/PageHeader';
import Card from '../../shared/ui/Card';
import Tabs from '../../shared/ui/Tabs';
import ProfileForm from '../components/ProfileForm';
import SecuritySettings from '../components/SecuritySettings';
import Loading from '../../shared/ui/Loading';
import ErrorState from '../../shared/ui/ErrorState';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/ui/Button';

const ProfilePage = () => {
  const { profile, loading, error } = useAccount();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  if (loading) {
    return <Loading fullPage text="Loading profile..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Could not load profile"
        description="There was an error loading your profile information. Please try again later."
        code={error.code}
        details={error.message}
        action={
          <Button onClick={() => navigate(0)} variant="primary">
            Refresh Page
          </Button>
        }
      />
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile Information' },
    { id: 'security', label: 'Security Settings' }
  ];

  return (
    <div>
      <PageHeader
        title="Your Profile"
        subtitle="Manage your personal information and account security"
      />

      <Card>
        <div className="mb-lg flex items-center">
          <div className="flex-shrink-0 mr-md">
            {/* Display user avatar or initials */}
            <div className="h-16 w-16 rounded-full bg-primary-500 flex items-center justify-center text-white text-xl font-semibold">
              {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold">{currentUser?.displayName || 'User'}</h2>
            <p className="text-text-secondary">{currentUser?.email}</p>
          </div>
        </div>

        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="mb-md"
        />

        <div className="mt-lg">
          {activeTab === 'profile' && <ProfileForm />}
          {activeTab === 'security' && <SecuritySettings />}
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;