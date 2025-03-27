// src/features/team/components/MyInvitations.js

import React, { useState } from 'react';
import { useTeam } from '../context/TeamContext';
import Card from '../../shared/ui/Card';
import Button from '../../shared/ui/Button';
import Badge from '../../shared/ui/Badge';
import Alert from '../../shared/ui/Alert';
import Loading from '../../shared/ui/Loading';
import EmptyState from '../../shared/ui/EmptyState';

const MyInvitations = () => {
  const {
    invitations,
    loading,
    error: contextError,
    acceptInvitation,
    declineInvitation
  } = useTeam();

  const [error, setError] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(null);

  if (loading && invitations.length === 0) {
    return <Loading text="Loading invitations..." />;
  }

  if (contextError || error) {
    return (
      <Alert variant="error" className="mb-md">
        {error || contextError}
      </Alert>
    );
  }

  if (!invitations || invitations.length === 0) {
    return (
      <Card className="mb-lg">
        <EmptyState
          title="No Team Invitations"
          description="You don't have any pending team invitations at the moment."
          compact
        />
      </Card>
    );
  }

  const handleAccept = async (teamId) => {
    setActionInProgress(teamId);
    setError(null);
    try {
      await acceptInvitation(teamId);
    } catch (err) {
      setError(`Failed to accept invitation: ${err.message}`);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDecline = async (teamId) => {
    setActionInProgress(teamId);
    setError(null);
    try {
      await declineInvitation(teamId);
    } catch (err) {
      setError(`Failed to decline invitation: ${err.message}`);
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <Card
      title="Team Invitations"
      className="mb-lg"
      subtitle={`You have ${invitations.length} pending invitation${invitations.length !== 1 ? 's' : ''}`}
    >
      {error && (
        <Alert
          variant="error"
          className="mb-md"
          onDismiss={() => setError(null)}
          dismissible
        >
          {error}
        </Alert>
      )}

      <div className="space-y-md">
        {invitations.map((invitation) => (
          <div
            key={invitation.invitationId}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-md rounded-md border border-border-light"
          >
            <div className="mb-md sm:mb-0">
              <div className="font-semibold text-lg">{invitation.teamName}</div>
              <div className="text-sm text-text-secondary">
                Invited by: {invitation.invitedBy}
              </div>
              <div className="text-sm text-text-tertiary">
                Expires: {new Date(invitation.expires).toLocaleDateString()}
              </div>
              {invitation.message && (
                <div className="text-sm text-text-secondary mt-2 p-sm bg-background-secondary rounded-md">
                  "{invitation.message}"
                </div>
              )}
            </div>

            <div className="flex space-x-sm">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDecline(invitation.teamId)}
                loading={actionInProgress === invitation.teamId}
                disabled={loading || actionInProgress}
              >
                Decline
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleAccept(invitation.teamId)}
                loading={actionInProgress === invitation.teamId}
                disabled={loading || actionInProgress}
              >
                Accept
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default MyInvitations;