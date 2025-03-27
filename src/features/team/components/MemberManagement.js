// src/features/team/components/MemberManagement.js

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTeam } from '../context/TeamContext';
import { useAuth } from '../../auth/context/AuthContext';
import Card from '../../shared/ui/Card';
import Button from '../../shared/ui/Button';
import Avatar from '../../shared/ui/Avatar';
import Modal from '../../shared/ui/Modal';
import Alert from '../../shared/ui/Alert';
import Loading from '../../shared/ui/Loading';

const MemberManagement = ({ teamId }) => {
  const { currentTeam, removeMember, loading } = useTeam();
  const { currentUser } = useAuth();

  const [confirmModal, setConfirmModal] = useState({ open: false, userId: null, name: '' });
  const [error, setError] = useState(null);

  // Ensure we have a team and it has members
  if (!currentTeam || !currentTeam.members) {
    return <Loading text="Loading team members..." />;
  }

  const isOwner = currentTeam.ownerId === currentUser?.uid;

  const handleRemoveMember = async () => {
    if (!confirmModal.userId) return;

    try {
      await removeMember(teamId, confirmModal.userId);
      setConfirmModal({ open: false, userId: null, name: '' });
    } catch (err) {
      setError(err.message || 'Failed to remove team member');
    }
  };

  const openConfirmModal = (userId, name) => {
    setConfirmModal({
      open: true,
      userId,
      name
    });
  };

  return (
    <div>
      <Card title="Team Members" className="mb-lg">
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
          {currentTeam.members.map((member) => {
            const isCurrentUser = member.userId === currentUser?.uid;
            const canRemove = isOwner && !isCurrentUser;

            return (
              <div
                key={member.userId}
                className="flex items-center justify-between py-sm px-md rounded-md hover:bg-background-secondary"
              >
                <div className="flex items-center space-x-md">
                  <Avatar
                    name={member.displayName || member.userId}
                    size="md"
                  />
                  <div>
                    <div className="font-medium">
                      {member.displayName || member.userId}
                      {isCurrentUser && (
                        <span className="ml-2 text-sm text-text-tertiary">(You)</span>
                      )}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {member.role === 'owner' ? 'Owner' : 'Member'}
                    </div>
                    <div className="text-xs text-text-tertiary">
                      Joined: {new Date(member.joined).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {canRemove && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openConfirmModal(member.userId, member.displayName || member.userId)}
                    className="text-error-500"
                  >
                    Remove
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, userId: null, name: '' })}
        title="Remove Team Member"
        footer={
          <div className="flex justify-end space-x-md">
            <Button
              variant="ghost"
              onClick={() => setConfirmModal({ open: false, userId: null, name: '' })}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleRemoveMember}
              loading={loading}
              disabled={loading}
            >
              Remove Member
            </Button>
          </div>
        }
      >
        <p>
          Are you sure you want to remove <strong>{confirmModal.name}</strong> from this team?
        </p>
        <p className="mt-sm text-text-secondary">
          They will lose access to all team datasets and reports.
        </p>
      </Modal>
    </div>
  );
};

MemberManagement.propTypes = {
  teamId: PropTypes.string.isRequired,
};

export default MemberManagement;