// src/features/subscription/components/TrialActivation.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../../shared/ui/Button';
import Modal from '../../shared/ui/Modal';
import Alert from '../../shared/ui/Alert';

const TrialActivation = ({
  plan,
  onActivate,
  onCancel,
  isOpen,
  className = '',
  ...props
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleActivate = async () => {
    setLoading(true);
    setError(null);

    try {
      await onActivate(plan.id);
    } catch (err) {
      setError(err.message || 'Failed to activate trial');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={`Start Free Trial: ${plan.name} Plan`}
      className={className}
      {...props}
    >
      <div className="space-y-4">
        <p className="text-text-secondary">
          You are about to start your free 90-day trial of the {plan.name} Plan. No credit card is required for the trial period.
        </p>

        <div className="bg-background-secondary p-4 rounded-md">
          <h4 className="font-medium mb-2">Plan Features:</h4>
          <ul className="space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <svg className="h-5 w-5 text-success-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-text-secondary">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {error && (
          <Alert variant="error" onDismiss={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        <div className="flex space-x-3 justify-end mt-6">
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleActivate} loading={loading}>
            Start Free Trial
          </Button>
        </div>
      </div>
    </Modal>
  );
};

TrialActivation.propTypes = {
  plan: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    features: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  onActivate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  className: PropTypes.string,
};

export default TrialActivation;