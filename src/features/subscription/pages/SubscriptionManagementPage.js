// src/features/subscription/pages/SubscriptionManagementPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../shared/ui/PageHeader';
import Button from '../../shared/ui/Button';
import Card from '../../shared/ui/Card';
import Alert from '../../shared/ui/Alert';
import Modal from '../../shared/ui/Modal';
import Loading from '../../shared/ui/Loading';
import SubscriptionStatus from '../components/SubscriptionStatus';
import BillingHistory from '../components/BillingHistory';
import { useSubscription } from '../context/SubscriptionContext';

const SubscriptionManagementPage = () => {
  const { subscription, cancelSubscription, loading, error: contextError } = useSubscription();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  // Handle cancel subscription
  const handleCancelSubscription = async () => {
    setError(null);
    setSuccess(null);
    setProcessing(true);

    try {
      await cancelSubscription();
      setShowCancelModal(false);
      setSuccess('Your subscription has been cancelled. You will have access to your current plan until the end of your billing period.');
    } catch (err) {
      setError(err.message || 'Failed to cancel subscription. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <Loading fullPage text="Loading subscription details..." />;
  }

  if (!subscription) {
    return (
      <div className="container mx-auto px-md py-lg">
        <PageHeader
          title="Subscription Management"
          subtitle="Manage your subscription details"
          backLink={
            <Button
              variant="ghost"
              leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              }
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
          }
        />

        <Card className="text-center p-xl">
          <div className="text-text-tertiary mb-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-md">No Active Subscription</h2>
          <p className="text-text-secondary mb-lg">
            You don't have an active subscription. Choose a plan to unlock all features.
          </p>
          <Button variant="primary" onClick={() => navigate('/subscription/plans')}>
            View Plans
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-md py-lg">
      <PageHeader
        title="Subscription Management"
        subtitle="Manage your subscription details"
        backLink={
          <Button
            variant="ghost"
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            }
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        }
        actions={
          <Button
            variant="primary"
            onClick={() => navigate('/subscription/plans')}
          >
            Change Plan
          </Button>
        }
      />

      {contextError || error ? (
        <Alert
          variant="error"
          className="mb-lg"
          onDismiss={() => setError(null)}
          dismissible
        >
          {contextError || error}
        </Alert>
      ) : null}

      {success && (
        <Alert
          variant="success"
          className="mb-lg"
        >
          {success}
        </Alert>
      )}

      <div className="space-y-lg">
        <SubscriptionStatus
          subscription={subscription}
          onUpgrade={() => navigate('/subscription/plans')}
          onCancel={() => setShowCancelModal(true)}
        />

        <Card>
          <div className="p-md border-b border-border-light">
            <h2 className="text-lg font-semibold">Plan Details</h2>
          </div>
          <div className="p-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div>
                <p className="text-text-secondary text-sm">Plan</p>
                <p className="font-medium capitalize">{subscription.plan}</p>
              </div>
              <div>
                <p className="text-text-secondary text-sm">Status</p>
                <p className="font-medium capitalize">{subscription.status}</p>
              </div>
              {subscription.trialEnd && (
                <div>
                  <p className="text-text-secondary text-sm">Trial Ends</p>
                  <p className="font-medium">{new Date(subscription.trialEnd).toLocaleDateString()}</p>
                </div>
              )}
              {subscription.expiresAt && (
                <div>
                  <p className="text-text-secondary text-sm">Expires</p>
                  <p className="font-medium">{new Date(subscription.expiresAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        <BillingHistory />
      </div>

      {/* Cancel Subscription Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Subscription"
      >
        <div className="p-md">
          <div className="text-error-500 mb-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-center mb-md">Are you sure you want to cancel?</h3>
          <p className="text-text-secondary mb-md">
            Cancelling your subscription will:
          </p>
          <ul className="list-disc pl-6 mb-lg text-text-secondary">
            <li>Allow you to continue using your current plan until the end of your billing period</li>
            <li>Not provide a refund for the current billing period</li>
            <li>Disable advanced features when your subscription expires</li>
          </ul>
          <div className="flex justify-center space-x-sm">
            <Button
              variant="outline"
              onClick={() => setShowCancelModal(false)}
              disabled={processing}
            >
              Keep My Subscription
            </Button>
            <Button
              variant="danger"
              onClick={handleCancelSubscription}
              loading={processing}
            >
              Cancel Subscription
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SubscriptionManagementPage;