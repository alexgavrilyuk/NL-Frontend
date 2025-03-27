// src/features/team/pages/CreateTeamPage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../shared/ui/PageHeader';
import Button from '../../shared/ui/Button';
import CreateTeamForm from '../components/CreateTeamForm';

const CreateTeamPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/team');
  };

  return (
    <div>
      <PageHeader
        title="Create New Team"
        subtitle="Set up a team to collaborate with your colleagues"
        backLink={
          <Button
            variant="ghost"
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            }
            onClick={handleBack}
          >
            Back to Teams
          </Button>
        }
      />

      <CreateTeamForm />
    </div>
  );
};

export default CreateTeamPage;