// src/features/subscription/components/SubscriptionStatus.js
import React from 'react';
import PropTypes from 'prop-types';
import Card from '../../shared/ui/Card';
import Button from '../../shared/ui/Button';
import Badge from '../../shared/ui/Badge';
import { format, parseISO, formatDistanceToNow } from 'date-fns';

const SubscriptionStatus = ({
  subscription,
  onUpgrade,
  onCancel,
  className = '',
  ...props
}) => {
  if (!subscription) {
    return (
      <Card className={`${className} text-center p-8`} {...props}>
        <h3 className="text-xl font-bold mb-4">No Active Subscription</h3>
        <p className="text-text-secondary mb-6">
          You don't have an active subscription. Select a plan to access all features.
        </p>
        <Button variant="primary" onClick={onUpgrade}>
          View Plans
        </Button>
      </Card>
    );
  }

  const { plan, status, trialEnd, expiresAt } = subscription;

  const isTrialActive = status === 'trial';
  const isCancelled = status === 'cancelled';

  // Format dates
  const formattedTrialEnd = trialEnd ? format(parseISO(trialEnd), 'MMMM d, yyyy') : null;
  const formattedExpiresAt = expiresAt ? format(parseISO(expiresAt), 'MMMM d, yyyy') : null;

  // Calculate days remaining
  const trialDaysLeft = trialEnd ?
    Math.max(0, Math.ceil((new Date(trialEnd) - new Date()) / (1000 * 60 * 60 * 24))) :
    null;

  return (
    <Card className={className} {...props}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <div className="flex items-center">
            <h3 className="text-xl font-bold capitalize">{plan} Plan</h3>
            <Badge
              variant={isTrialActive ? "info" : isCancelled ? "error" : "success"}
              className="ml-2"
              size="sm"
            >
              {status}
            </Badge>
          </div>

          {isTrialActive && (
            <p className="text-text-secondary mt-1">
              Your trial ends on {formattedTrialEnd} ({trialDaysLeft} {trialDaysLeft === 1 ? 'day' : 'days'} remaining)
            </p>
          )}

          {isCancelled && (
            <p className="text-text-secondary mt-1">
              Your subscription will end on {formattedExpiresAt}
            </p>
          )}

          {!isTrialActive && !isCancelled && (
            <p className="text-text-secondary mt-1">
              Your subscription is active
            </p>
          )}
        </div>

        <div className="mt-4 md:mt-0 flex space-x-2">
          {isCancelled && (
            <Button variant="primary" onClick={onUpgrade}>
              Renew Subscription
            </Button>
          )}

          {isTrialActive && (
            <Button variant="primary" onClick={onUpgrade}>
              Subscribe Now
            </Button>
          )}

          {!isTrialActive && !isCancelled && (
            <>
              <Button variant="outline" onClick={onUpgrade}>
                Change Plan
              </Button>
              <Button variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

SubscriptionStatus.propTypes = {
  subscription: PropTypes.shape({
    plan: PropTypes.string,
    status: PropTypes.string,
    trialEnd: PropTypes.string,
    expiresAt: PropTypes.string
  }),
  onUpgrade: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default SubscriptionStatus;