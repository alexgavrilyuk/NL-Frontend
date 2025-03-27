// src/features/subscription/components/PlanCard.js
import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../shared/ui/Button';
import Card from '../../shared/ui/Card';
import Badge from '../../shared/ui/Badge';

const PlanCard = ({
  plan,
  isCurrentPlan,
  onSelect,
  onTrialActivate,
  className = '',
  ...props
}) => {
  const {
    id,
    name,
    description,
    price,
    interval,
    features,
    popular
  } = plan;

  const handleAction = () => {
    if (isCurrentPlan) {
      return; // Already on this plan
    }
    onSelect(id);
  };

  const handleTrialActivate = (e) => {
    e.stopPropagation();
    onTrialActivate(id);
  };

  return (
    <Card
      className={`h-full ${isCurrentPlan ? 'border-primary-500 border-2' : ''} ${className}`}
      variant={isCurrentPlan ? 'filled' : 'default'}
      {...props}
    >
      <div className="text-center mb-4">
        {popular && (
          <Badge variant="primary" className="mb-2">Most Popular</Badge>
        )}
        <h3 className="text-xl font-bold">{name}</h3>
        <p className="text-text-secondary mb-2">{description}</p>
        <div className="mt-3">
          <span className="text-3xl font-bold">${price}</span>
          <span className="text-text-secondary">/{interval}</span>
        </div>
      </div>

      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg className="h-5 w-5 text-success-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-text-secondary">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        {isCurrentPlan ? (
          <Button variant="secondary" fullWidth disabled>
            Current Plan
          </Button>
        ) : (
          <div className="space-y-2">
            <Button variant="primary" fullWidth onClick={handleAction}>
              Select Plan
            </Button>
            <Button variant="outline" fullWidth onClick={handleTrialActivate}>
              Start Free Trial
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

PlanCard.propTypes = {
  plan: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    interval: PropTypes.string.isRequired,
    features: PropTypes.arrayOf(PropTypes.string).isRequired,
    popular: PropTypes.bool
  }).isRequired,
  isCurrentPlan: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  onTrialActivate: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default PlanCard;