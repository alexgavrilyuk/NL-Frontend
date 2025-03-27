// src/features/team/pages/TeamDetailPage.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTeam } from '../context/TeamContext';
import PageHeader from '../../shared/ui/PageHeader';
import Button from '../../shared/ui/Button';
import Loading from '../../shared/ui/Loading';
import ErrorState from '../../shared/ui/ErrorState';
import TeamDetail from '../components/TeamDetail';
import teamService from '../services/teamService';

const TeamDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentTeam,
    teams,
    selectTeam,
    loadTeams
  } = useTeam();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [team, setTeam] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      setError(null);

      try {
        // Try to select the team from context first
        if (teams.length > 0) {
          const found = selectTeam(id);
          if (found) {
            setTeam(currentTeam);
            setLoading(false);
            return;
          }
        }

        // If not found in context, fetch directly
        const response = await teamService.getTeam(id);
        setTeam(response.data.team);

        // Refresh teams list to include this team
        loadTeams();
      } catch (err) {
        console.error('Error fetching team:', err);
        setError(err.message || 'Failed to load team details');
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [id, currentTeam, teams, selectTeam, loadTeams]);

  const backToTeams = () => {
    navigate('/team');
  };

  if (loading) {
    return <Loading fullPage text="Loading team details..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Could not load team"
        description={error}
        action={
          <Button variant="primary" onClick={backToTeams}>
            Back to Teams
          </Button>
        }
      />
    );
  }

  if (!team) {
    return (
      <ErrorState
        title="Team not found"
        description="The team you're looking for doesn't exist or you don't have permission to view it."
        action={
          <Button variant="primary" onClick={backToTeams}>
            Back to Teams
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <PageHeader
        title={team.name}
        backLink={
          <Button
            variant="ghost"
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            }
            onClick={backToTeams}
          >
            Back to Teams
          </Button>
        }
        actions={
          <div className="flex space-x-sm">
            <Link to={`/datasets?teamId=${id}`}>
              <Button variant="secondary">
                Team Datasets
              </Button>
            </Link>
            <Link to={`/reports?teamId=${id}`}>
              <Button variant="secondary">
                Team Reports
              </Button>
            </Link>
          </div>
        }
      />

      <TeamDetail teamId={id} />
    </div>
  );
};

export default TeamDetailPage;