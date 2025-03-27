// src/features/subscription/components/UpgradePrompt.js
import React from 'react';
import PropTypes from 'prop-types';
import Card from '../../shared/ui/Card';
import Button from '../../shared/ui/Button';

const UpgradePrompt = ({
  title = "Upgrade Your Plan",
  message = "This feature requires a higher subscription tier.",
  requiredPlan,
  onViewPlans,
  className = '',
  ...props
}) => {
  return (
    <Card className={`text-center p-8 ${className}`} {...props}>
      <div className="text-primary-500 mb-4">
        <svg className="w-16 h-16 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>

      <h3 className="text-xl font-bold mb-2">{title}</h3>

      <p className="text-text-secondary mb-2">{message}</p>

      {requiredPlan && (
        <p className="text-text-primary font-medium mb-4">
          Requires: <span className="text-primary-500 capitalize">{requiredPlan} Plan</span> or higher
        </p>
      )}

      <Button variant="primary" onClick={onViewPlans}>
        View Plans
      </Button>
    </Card>
  );
};

UpgradePrompt.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  requiredPlan: PropTypes.string,
  onViewPlans: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default UpgradePrompt;