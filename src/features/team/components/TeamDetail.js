// src/features/team/components/TeamDetail.js

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useTeam } from '../context/TeamContext';
import { useAuth } from '../../auth/context/AuthContext';
import Card from '../../shared/ui/Card';
import Button from '../../shared/ui/Button';
import Avatar from '../../shared/ui/Avatar';
import Modal from '../../shared/ui/Modal';
import Alert from '../../shared/ui/Alert';
import Tabs from '../../shared/ui/Tabs';
import MemberManagement from './MemberManagement';
import InvitationForm from './InvitationForm';
import InvitationList from './InvitationList';

const TeamDetail = ({ teamId }) => {
  const navigate = useNavigate();
  const { currentTeam, updateTeam, deleteTeam, loading, error: teamError } = useTeam();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('members');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: currentTeam?.name || '',
    description: currentTeam?.description || '',
    context: currentTeam?.context || {}
  });
  const [error, setError] = useState(null);

  if (!currentTeam) {
    return (
      <Alert
        variant="info"
        title="Team not found"
        className="mb-lg"
      >
        The requested team could not be found. It may have been deleted or you don't have access to it.
      </Alert>
    );
  }

  const isOwner = currentTeam.ownerId === currentUser?.uid;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('context.')) {
      const contextField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        context: {
          ...prev.context,
          [contextField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    try {
      // Basic validation
      if (!formData.name.trim()) {
        setError('Team name is required');
        return;
      }

      await updateTeam(teamId, formData);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to update team');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTeam(teamId);
      navigate('/team', { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to delete team');
      setShowDeleteModal(false);
    }
  };

  const tabs = [
    { id: 'members', label: 'Members' },
    { id: 'invitations', label: 'Invitations' },
    { id: 'settings', label: 'Team Settings' },
  ];

  // Filter to get pending invitations only
  const pendingInvitations = currentTeam.invitations?.filter(invitation =>
    invitation.status === 'pending'
  ) || [];

  return (
    <div>
      {(teamError || error) && (
        <Alert
          variant="error"
          className="mb-md"
          onDismiss={() => setError(null)}
          dismissible
        >
          {error || teamError}
        </Alert>
      )}

      <Card className="mb-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-md">
            <Avatar
              name={currentTeam.name}
              size="xl"
              variant="square"
            />
            <div>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-background-secondary border border-border-normal rounded-md px-sm py-1 mb-1 w-full"
                  placeholder="Team Name"
                />
              ) : (
                <h2 className="text-xxl font-bold">{currentTeam.name}</h2>
              )}

              {isEditing ? (
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  className="bg-background-secondary border border-border-normal rounded-md px-sm py-1 w-full"
                  placeholder="Team Description"
                  rows={2}
                />
              ) : (
                <p className="text-text-secondary">
                  {currentTeam.description || 'No description'}
                </p>
              )}

              <div className="mt-2 text-sm text-text-tertiary">
                Created: {new Date(currentTeam.created).toLocaleDateString()}
              </div>
            </div>
          </div>

          {isOwner && (
            <div className="flex space-x-sm">
              {isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setIsEditing(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    loading={loading}
                    disabled={loading}
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Team
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Delete Team
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </Card>

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        className="mb-lg"
      />

      {activeTab === 'members' && (
        <>
          <MemberManagement teamId={teamId} />
          {isOwner && <InvitationForm teamId={teamId} />}
        </>
      )}

      {activeTab === 'invitations' && (
        <InvitationList teamId={teamId} teamInvitations={pendingInvitations} />
      )}

      {activeTab === 'settings' && (
        <Card title="Team Context Settings" className="mb-lg">
          <p className="text-text-secondary mb-md">
            These settings provide context to the AI when generating reports for your team.
          </p>

          <div className="space-y-md">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Business Type
              </label>
              <input
                type="text"
                name="context.business"
                value={formData.context?.business || ''}
                onChange={handleChange}
                className="bg-background-primary border border-border-normal rounded-md px-md py-sm w-full"
                placeholder="e.g., Financial Services, Retail, Manufacturing"
                disabled={!isOwner || loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Industry
              </label>
              <input
                type="text"
                name="context.industry"
                value={formData.context?.industry || ''}
                onChange={handleChange}
                className="bg-background-primary border border-border-normal rounded-md px-md py-sm w-full"
                placeholder="e.g., Banking, Apparel, Automotive"
                disabled={!isOwner || loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Fiscal Year Start
              </label>
              <select
                name="context.preferences.fiscalYearStart"
                value={formData.context?.preferences?.fiscalYearStart || 'January'}
                onChange={handleChange}
                className="bg-background-primary border border-border-normal rounded-md px-md py-sm w-full"
                disabled={!isOwner || loading}
              >
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Reporting Currency
              </label>
              <select
                name="context.preferences.reportingCurrency"
                value={formData.context?.preferences?.reportingCurrency || 'USD'}
                onChange={handleChange}
                className="bg-background-primary border border-border-normal rounded-md px-md py-sm w-full"
                disabled={!isOwner || loading}
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="JPY">JPY - Japanese Yen</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="AUD">AUD - Australian Dollar</option>
                <option value="CHF">CHF - Swiss Franc</option>
              </select>
            </div>
          </div>

          {isOwner && (
            <div className="mt-lg flex justify-end">
              <Button
                variant="primary"
                onClick={handleSave}
                loading={loading}
                disabled={loading}
              >
                Save Settings
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Team"
        footer={
          <div className="flex justify-end space-x-md">
            <Button
              variant="ghost"
              onClick={() => setShowDeleteModal(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={loading}
              disabled={loading}
            >
              Delete Team
            </Button>
          </div>
        }
      >
        <p>
          Are you sure you want to delete the team <strong>{currentTeam.name}</strong>?
        </p>
        <p className="mt-sm text-text-secondary">
          This action cannot be undone. All team members will lose access to shared datasets and reports.
        </p>
      </Modal>
    </div>
  );
};

TeamDetail.propTypes = {
  teamId: PropTypes.string.isRequired,
};

export default TeamDetail;