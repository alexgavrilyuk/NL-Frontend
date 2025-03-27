// src/features/team/context/TeamContext.js

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import teamService from '../services/teamService';
import { useAuth } from '../../auth/context/AuthContext';

// Create context
const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const [teams, setTeams] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load teams when the user is authenticated
  useEffect(() => {
    if (currentUser) {
      loadTeams();
      loadInvitations();
    } else {
      setTeams([]);
      setCurrentTeam(null);
      setInvitations([]);
      setLoading(false);
    }
  }, [currentUser]);

  // Load all teams
  const loadTeams = useCallback(async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError(null);

      const response = await teamService.getTeams();
      setTeams(response.data.teams);

      // Set current team to the first team if none is selected
      if (response.data.teams.length > 0 && !currentTeam) {
        setCurrentTeam(response.data.teams[0]);
      }
    } catch (error) {
      console.error('Error loading teams:', error);
      setError(error.message || 'Failed to load teams');
    } finally {
      setLoading(false);
    }
  }, [currentUser, currentTeam]);

  // Load pending invitations
  const loadInvitations = useCallback(async () => {
    if (!currentUser) return;

    try {
      const response = await teamService.getPendingInvitations();
      setInvitations(response.data.invitations);
    } catch (error) {
      console.error('Error loading invitations:', error);
    }
  }, [currentUser]);

  // Create a new team
  const createTeam = async (teamData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await teamService.createTeam(teamData);
      const newTeam = response.data.team;

      setTeams(prevTeams => [...prevTeams, newTeam]);
      setCurrentTeam(newTeam);

      return newTeam;
    } catch (error) {
      setError(error.message || 'Failed to create team');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update a team
  const updateTeam = async (teamId, teamData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await teamService.updateTeam(teamId, teamData);
      const updatedTeam = response.data.team;

      setTeams(prevTeams =>
        prevTeams.map(team =>
          team.id === teamId ? updatedTeam : team
        )
      );

      // Update current team if it was the one that got updated
      if (currentTeam && currentTeam.id === teamId) {
        setCurrentTeam(updatedTeam);
      }

      return updatedTeam;
    } catch (error) {
      setError(error.message || 'Failed to update team');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete a team
  const deleteTeam = async (teamId) => {
    try {
      setLoading(true);
      setError(null);

      await teamService.deleteTeam(teamId);

      // Remove team from state
      setTeams(prevTeams => prevTeams.filter(team => team.id !== teamId));

      // Clear current team if it was the one that got deleted
      if (currentTeam && currentTeam.id === teamId) {
        setCurrentTeam(teams.length > 0 ? teams[0] : null);
      }

      return true;
    } catch (error) {
      setError(error.message || 'Failed to delete team');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Select a team to be the current team
  const selectTeam = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    if (team) {
      setCurrentTeam(team);
      return true;
    }
    return false;
  };

  // Invite a member to a team
  const inviteMember = async (teamId, inviteData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await teamService.inviteTeamMember(teamId, inviteData);

      // Refresh team data to include new invitation
      await loadTeams();

      return response.data;
    } catch (error) {
      setError(error.message || 'Failed to invite member');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Accept an invitation
  const acceptInvitation = async (teamId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await teamService.acceptInvitation(teamId);

      // Refresh teams and invitations
      await loadTeams();
      await loadInvitations();

      return response.data;
    } catch (error) {
      setError(error.message || 'Failed to accept invitation');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Decline an invitation
  const declineInvitation = async (teamId) => {
    try {
      setLoading(true);
      setError(null);

      await teamService.declineInvitation(teamId);

      // Remove invitation from state
      setInvitations(prevInvitations =>
        prevInvitations.filter(invitation => invitation.teamId !== teamId)
      );

      return true;
    } catch (error) {
      setError(error.message || 'Failed to decline invitation');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Remove a member from a team
  const removeMember = async (teamId, userId) => {
    try {
      setLoading(true);
      setError(null);

      await teamService.removeTeamMember(teamId, userId);

      // Refresh team data
      if (currentTeam && currentTeam.id === teamId) {
        const updatedTeamResponse = await teamService.getTeam(teamId);
        const updatedTeam = updatedTeamResponse.data.team;

        setCurrentTeam(updatedTeam);
        setTeams(prevTeams =>
          prevTeams.map(team =>
            team.id === teamId ? updatedTeam : team
          )
        );
      }

      return true;
    } catch (error) {
      setError(error.message || 'Failed to remove member');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    teams,
    currentTeam,
    invitations,
    loading,
    error,
    loadTeams,
    loadInvitations,
    createTeam,
    updateTeam,
    deleteTeam,
    selectTeam,
    inviteMember,
    acceptInvitation,
    declineInvitation,
    removeMember,
    clearError: () => setError(null)
  };

  return (
    <TeamContext.Provider value={value}>
      {children}
    </TeamContext.Provider>
  );
};

// Custom hook for accessing team context
export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};

export default TeamContext;