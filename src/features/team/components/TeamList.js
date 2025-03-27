// src/features/team/components/TeamList.js

import React from 'react';
import { Link } from 'react-router-dom';
import { useTeam } from '../context/TeamContext';
import Card from '../../shared/ui/Card';
import Button from '../../shared/ui/Button';
import Loading from '../../shared/ui/Loading';
import EmptyState from '../../shared/ui/EmptyState';
import ErrorState from '../../shared/ui/ErrorState';
import Avatar from '../../shared/ui/Avatar';

const TeamList = () => {
  const { teams, loading, error, currentTeam, selectTeam } = useTeam();

  if (loading) {
    return <Loading text="Loading teams..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Could not load teams"
        description={error}
        action={
          <Button variant="primary">Try Again</Button>
        }
      />
    );
  }

  if (!teams || teams.length === 0) {
    return (
      <EmptyState
        title="No Teams Yet"
        description="Create your first team to start collaborating with your colleagues."
        action={
          <Link to="/team/new">
            <Button variant="primary">Create Team</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-md">
      {teams.map((team) => (
        <Card
          key={team.id}
          className={`cursor-pointer transition-all ${
            currentTeam && currentTeam.id === team.id
              ? 'border-primary-500 shadow-md'
              : 'hover:shadow-md'
          }`}
          onClick={() => selectTeam(team.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-md">
              <Avatar
                name={team.name}
                size="lg"
                variant="square"
              />
              <div>
                <h3 className="text-lg font-semibold">{team.name}</h3>
                {team.description && (
                  <p className="text-text-secondary">{team.description}</p>
                )}
                <div className="mt-2 text-sm text-text-tertiary">
                  {team.members?.length || 0} team members
                </div>
              </div>
            </div>
            <div className="flex space-x-md">
              <Link to={`/team/${team.id}`}>
                <Button
                  variant="secondary"
                  size="sm"
                  rightIcon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  }
                >
                  View Details
                </Button>
              </Link>
            </div>
          </div>
          {team.members && team.members.length > 0 && (
            <div className="mt-md pt-md border-t border-border-light">
              <div className="flex -space-x-2 overflow-hidden">
                {team.members.slice(0, 5).map((member, index) => (
                  <Avatar
                    key={index}
                    name={member.userId}
                    size="sm"
                    className="border-2 border-background-primary"
                  />
                ))}
                {team.members.length > 5 && (
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background-secondary border-2 border-background-primary text-sm text-text-secondary">
                    +{team.members.length - 5}
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default TeamList;