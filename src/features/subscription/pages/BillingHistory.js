// src/features/subscription/components/BillingHistory.js
import React from 'react';
import PropTypes from 'prop-types';
import Card from '../../shared/ui/Card';
import EmptyState from '../../shared/ui/EmptyState';

const BillingHistory = ({ className = '', ...props }) => {
  // This is a placeholder component - in a real implementation,
  // you would fetch billing history from an API
  const billingHistory = []; // Empty for now as this is just a placeholder

  return (
    <Card className={className} {...props}>
      <div className="p-md border-b border-border-light">
        <h2 className="text-lg font-semibold">Billing History</h2>
      </div>
      <div className="p-md">
        {billingHistory.length === 0 ? (
          <EmptyState
            title="No billing history yet"
            description="Your billing history will appear here once you have been billed for your subscription."
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            compact
          />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-2">Date</th>
                <th className="pb-2">Description</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {billingHistory.map((item, index) => (
                <tr key={index} className="border-t border-border-light">
                  <td className="py-3">{item.date}</td>
                  <td className="py-3">{item.description}</td>
                  <td className="py-3">{item.amount}</td>
                  <td className="py-3">{item.status}</td>
                  <td className="py-3">
                    <a href={item.receiptUrl} className="text-primary-500 hover:text-primary-700">
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  );
};

BillingHistory.propTypes = {
  className: PropTypes.string
};

export default BillingHistory;