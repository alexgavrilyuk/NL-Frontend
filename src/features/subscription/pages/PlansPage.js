// src/features/subscription/pages/PlansPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../shared/ui/PageHeader';
import Tabs from '../../shared/ui/Tabs';
import PlanCard from '../components/PlanCard';
import PlanComparison from '../components/PlanComparison';
import TrialActivation from '../components/TrialActivation';
import Modal from '../../shared/ui/Modal';
import Button from '../../shared/ui/Button';
import Alert from '../../shared/ui/Alert';
import Loading from '../../shared/ui/Loading';
import { useSubscription } from '../context/SubscriptionContext';

const PlansPage = () => {
  const { plans, subscription, activateTrial, changePlan, loading, error: contextError } = useSubscription();
  const [viewMode, setViewMode] = useState('cards');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [processingAction, setProcessingAction] = useState(false);
  const navigate = useNavigate();

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      setError(null);
      setSuccess(null);
    };
  }, []);

  // Set error from context
  useEffect(() => {
    if (contextError) {
      setError(contextError);
    }
  }, [contextError]);

  // Handle plan selection
  const handleSelectPlan = (planId) => {
    const plan = plans.find(p => p.id === planId);
    setSelectedPlan(plan);

    // If user already has subscription, show change confirmation
    if (subscription && subscription.status !== 'trial' && subscription.plan !== planId) {
      setShowChangeModal(true);
    }
    // If no subscription or on trial, show trial modal
    else if (!subscription || subscription.status === 'trial') {
      setShowTrialModal(true);
    }
  };

  // Handle trial activation
  const handleTrialActivate = async (planId) => {
    setError(null);
    setSuccess(null);
    setProcessingAction(true);

    try {
      await activateTrial(planId);
      setShowTrialModal(false);
      setSuccess(`Successfully activated ${selectedPlan.name} plan trial. Enjoy your 90-day free trial!`);
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to activate trial. Please try again.');
    } finally {
      setProcessingAction(false);
    }
  };

  // Handle plan change
  const handleChangePlan = async (planId) => {
    setError(null);
    setSuccess(null);
    setProcessingAction(true);

    try {
      await changePlan(planId);
      setShowChangeModal(false);
      setSuccess(`Successfully changed to ${selectedPlan.name} plan.`);
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to change plan. Please try again.');
    } finally {
      setProcessingAction(false);
    }
  };

  if (loading && !plans.length) {
    return <Loading fullPage text="Loading subscription plans..." />;
  }

  return (
    <div className="container mx-auto px-md py-lg">
      <PageHeader
        title="Subscription Plans"
        subtitle="Choose a plan that best fits your needs"
      />

      {error && (
        <Alert
          variant="error"
          className="mb-lg"
          onDismiss={() => setError(null)}
          dismissible
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          variant="success"
          className="mb-lg"
        >
          {success}
        </Alert>
      )}

      {subscription && (
        <Alert
          variant="info"
          className="mb-lg"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <p className="font-medium">Current Plan: <span className="capitalize">{subscription.plan}</span></p>
              <p className="text-sm">
                Status: <span className="capitalize">{subscription.status}</span>
                {subscription.status === 'trial' && subscription.trialEnd && (
                  <> (Ends on {new Date(subscription.trialEnd).toLocaleDateString()})</>
                )}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 md:mt-0"
              onClick={() => navigate('/subscription/management')}
            >
              Manage Subscription
            </Button>
          </div>
        </Alert>
      )}

      <Tabs
        tabs={[
          { id: 'cards', label: 'Plans' },
          { id: 'comparison', label: 'Feature Comparison' }
        ]}
        activeTab={viewMode}
        onChange={setViewMode}
        className="mb-lg"
      />

      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {plans.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={subscription?.plan === plan.id}
              onSelect={handleSelectPlan}
              onTrialActivate={() => {
                setSelectedPlan(plan);
                setShowTrialModal(true);
              }}
            />
          ))}
        </div>
      )}

      {viewMode === 'comparison' && (
        <PlanComparison
          plans={plans}
          currentPlanId={subscription?.plan}
        />
      )}

      {/* Trial Activation Modal */}
      {selectedPlan && (
        <TrialActivation
          plan={selectedPlan}
          isOpen={showTrialModal}
          onActivate={() => handleTrialActivate(selectedPlan.id)}
          onCancel={() => setShowTrialModal(false)}
        />
      )}

      {/* Plan Change Confirmation Modal */}
      {selectedPlan && (
        <Modal
          isOpen={showChangeModal}
          onClose={() => setShowChangeModal(false)}
          title="Change Subscription Plan"
        >
          <div className="p-md">
            <p className="mb-md">
              Are you sure you want to change from <span className="font-medium capitalize">{subscription?.plan}</span> to <span className="font-medium capitalize">{selectedPlan.name}</span> plan?
            </p>
            <p className="text-text-secondary mb-lg">
              The change will take effect immediately. You will be charged the new rate on your next billing cycle.
            </p>
            <div className="flex justify-end space-x-sm">
              <Button
                variant="ghost"
                onClick={() => setShowChangeModal(false)}
                disabled={processingAction}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => handleChangePlan(selectedPlan.id)}
                loading={processingAction}
              >
                Confirm Change
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PlansPage;