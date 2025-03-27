// src/features/team/components/InvitationList.js

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTeam } from '../context/TeamContext';
import Card from '../../shared/ui/Card';
import Button from '../../shared/ui/Button';
import Badge from '../../shared/ui/Badge';
import EmptyState from '../../shared/ui/EmptyState';
import Alert from '../../shared/ui/Alert';
import Loading from '../../shared/ui/Loading';

const InvitationList = ({ teamId, teamInvitations }) => {
  const { loading, error: contextError } = useTeam();
  const [error, setError] = useState(null);

  if (loading) {
    return <Loading text="Loading invitations..." />;
  }

  if (contextError || error) {
    return (
      <Alert variant="error" className="mb-md">
        {error || contextError}
      </Alert>
    );
  }

  if (!teamInvitations || teamInvitations.length === 0) {
    return (
      <Card title="Pending Invitations" className="mb-lg">
        <EmptyState
          title="No Pending Invitations"
          description="All sent invitations have been accepted or declined."
          compact
        />
      </Card>
    );
  }

  // Helper function to determine badge variant based on invitation status
  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'success';
      case 'declined':
        return 'error';
      default:
        return 'default';
    }
  };

  // Helper function to format date to a readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      return 'Invalid date';
    }
  };

  return (
    <Card
      title="Pending Invitations"
      className="mb-lg"
      subtitle={`${teamInvitations.length} pending invitation${teamInvitations.length !== 1 ? 's' : ''}`}
    >
      <div className="space-y-md">
        {teamInvitations.map((invitation) => (
          <div
            key={invitation.email}
            className="flex items-center justify-between py-sm px-md rounded-md hover:bg-background-secondary"
          >
            <div>
              <div className="font-medium">{invitation.email}</div>
              <div className="text-sm text-text-tertiary">
                Invited on: {formatDate(invitation.createdAt || invitation.sentAt)}
              </div>
              {invitation.expires && (
                <div className="text-xs text-text-tertiary">
                  Expires on: {formatDate(invitation.expires)}
                </div>
              )}
              {invitation.message && (
                <div className="text-sm text-text-secondary mt-1 italic">
                  "{invitation.message}"
                </div>
              )}
            </div>

            <div className="flex items-center space-x-sm">
              <Badge variant={getStatusVariant(invitation.status)}>
                {invitation.status ? invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1) : 'Pending'}
              </Badge>
              {invitation.status === 'pending' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-error-500"
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

InvitationList.propTypes = {
  teamId: PropTypes.string.isRequired,
  teamInvitations: PropTypes.arrayOf(
    PropTypes.shape({
      email: PropTypes.string.isRequired,
      status: PropTypes.string,
      createdAt: PropTypes.string,
      sentAt: PropTypes.string,
      expires: PropTypes.string,
      message: PropTypes.string
    })
  ).isRequired
};

export default InvitationList;