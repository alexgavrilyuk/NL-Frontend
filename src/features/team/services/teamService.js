// src/features/team/services/teamService.js

import apiClient from '../../shared/api/apiClient';

class TeamService {
  // Create a new team
  async createTeam(teamData) {
    try {
      const response = await apiClient.post('/teams', teamData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get all teams for the current user
  async getTeams() {
    try {
      const response = await apiClient.get('/teams');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get a specific team by ID
  async getTeam(teamId) {
    try {
      const response = await apiClient.get(`/teams/${teamId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update team details
  async updateTeam(teamId, teamData) {
    try {
      const response = await apiClient.put(`/teams/${teamId}`, teamData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Delete a team
  async deleteTeam(teamId) {
    try {
      const response = await apiClient.delete(`/teams/${teamId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Add a member to a team
  async addTeamMember(teamId, userData) {
    try {
      const response = await apiClient.post(`/teams/${teamId}/members`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Remove a member from a team
  async removeTeamMember(teamId, userId) {
    try {
      const response = await apiClient.delete(`/teams/${teamId}/members/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Send invitation to join team
  async inviteTeamMember(teamId, inviteData) {
    try {
      const response = await apiClient.post(`/teams/${teamId}/invite`, inviteData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get pending invitations
  async getPendingInvitations() {
    try {
      const response = await apiClient.get('/teams/invitations');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Accept team invitation
  async acceptInvitation(teamId) {
    try {
      const response = await apiClient.post(`/teams/invitations/${teamId}/accept`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Decline team invitation
  async declineInvitation(teamId) {
    try {
      const response = await apiClient.post(`/teams/invitations/${teamId}/decline`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new TeamService();