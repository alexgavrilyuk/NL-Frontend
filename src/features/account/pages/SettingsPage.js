// src/features/account/pages/SettingsPage.js

import React, { useState } from 'react';
import { useAccount } from '../context/AccountContext';
import PageHeader from '../../shared/ui/PageHeader';
import Card from '../../shared/ui/Card';
import Tabs from '../../shared/ui/Tabs';
import SettingsForm from '../components/SettingsForm';
import AIContextForm from '../components/AIContextForm';
import Loading from '../../shared/ui/Loading';
import ErrorState from '../../shared/ui/ErrorState';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/ui/Button';

const SettingsPage = () => {
  const { loading, error } = useAccount();
  const [activeTab, setActiveTab] = useState('settings');
  const navigate = useNavigate();

  if (loading) {
    return <Loading fullPage text="Loading settings..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Could not load settings"
        description="There was an error loading your settings. Please try again later."
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
    { id: 'settings', label: 'Application Settings' },
    { id: 'aiContext', label: 'AI Context Settings' }
  ];

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Customize your application experience and AI context"
      />

      <Card>
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="mb-md"
        />

        <div className="mt-lg">
          {activeTab === 'settings' && <SettingsForm />}
          {activeTab === 'aiContext' && <AIContextForm />}
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;