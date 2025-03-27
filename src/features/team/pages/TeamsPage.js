// src/features/team/pages/TeamsPage.js

import React from 'react';
import { Link } from 'react-router-dom';
import { useTeam } from '../context/TeamContext';
import PageHeader from '../../shared/ui/PageHeader';
import Button from '../../shared/ui/Button';
import TeamList from '../components/TeamList';
import MyInvitations from '../components/MyInvitations';

const TeamsPage = () => {
  const { invitations } = useTeam();

  return (
    <div>
      <PageHeader
        title="Teams"
        subtitle="Manage your teams and collaborate with colleagues"
        actions={
          <Link to="/team/new">
            <Button
              variant="primary"
              leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              }
            >
              Create New Team
            </Button>
          </Link>
        }
      />

      {invitations && invitations.length > 0 && (
        <MyInvitations />
      )}

      <TeamList />
    </div>
  );
};

export default TeamsPage;