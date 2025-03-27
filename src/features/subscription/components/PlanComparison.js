// src/features/subscription/components/PlanComparison.js
import React from 'react';
import PropTypes from 'prop-types';

const PlanComparison = ({
  plans,
  currentPlanId,
  className = '',
  ...props
}) => {
  // Collect all unique features across all plans
  const allFeatures = [];
  plans.forEach(plan => {
    plan.features.forEach(feature => {
      if (!allFeatures.includes(feature)) {
        allFeatures.push(feature);
      }
    });
  });

  return (
    <div className={`overflow-x-auto ${className}`} {...props}>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left p-4 border-b border-border-light"></th>
            {plans.map(plan => (
              <th
                key={plan.id}
                className={`text-center p-4 border-b ${plan.id === currentPlanId ? 'bg-primary-50 text-primary-700' : 'text-text-primary'}`}
              >
                <div className="font-bold text-lg">{plan.name}</div>
                <div className="text-xl font-bold mt-1">${plan.price}/{plan.interval}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allFeatures.map((feature, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-background-secondary' : ''}>
              <td className="p-4 border-b border-border-light text-text-secondary font-medium">
                {feature}
              </td>
              {plans.map(plan => (
                <td
                  key={plan.id}
                  className={`text-center p-4 border-b border-border-light ${plan.id === currentPlanId ? 'bg-primary-50' : ''}`}
                >
                  {plan.features.includes(feature) ? (
                    <svg className="h-5 w-5 text-success-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-text-tertiary mx-auto" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

PlanComparison.propTypes = {
  plans: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      interval: PropTypes.string.isRequired,
      features: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
  currentPlanId: PropTypes.string,
  className: PropTypes.string,
};

export default PlanComparison;