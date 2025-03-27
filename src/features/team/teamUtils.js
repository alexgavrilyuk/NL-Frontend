// src/features/team/teamUtils.js

/**
 * Helper functions for team-related functionality
 */

/**
 * Check if user is a member of the given team
 * @param {Object} team - The team object
 * @param {string} userId - The user ID to check
 * @returns {boolean} True if user is a member of the team
 */
export const isTeamMember = (team, userId) => {
  if (!team || !team.members || !userId) return false;
  return team.members.some(member => member.userId === userId);
};

/**
 * Check if user is the owner of the given team
 * @param {Object} team - The team object
 * @param {string} userId - The user ID to check
 * @returns {boolean} True if user is the owner of the team
 */
export const isTeamOwner = (team, userId) => {
  if (!team || !userId) return false;
  return team.ownerId === userId;
};

/**
 * Check if user is an admin of the given team
 * @param {Object} team - The team object
 * @param {string} userId - The user ID to check
 * @returns {boolean} True if user is an admin of the team
 */
export const isTeamAdmin = (team, userId) => {
  if (!team || !team.members || !userId) return false;
  const member = team.members.find(m => m.userId === userId);
  return member && member.role === 'admin';
};

/**
 * Get user's role in the team
 * @param {Object} team - The team object
 * @param {string} userId - The user ID to check
 * @returns {string|null} The user's role or null if not a member
 */
export const getUserRole = (team, userId) => {
  if (!team || !team.members || !userId) return null;
  const member = team.members.find(m => m.userId === userId);
  return member ? member.role : null;
};

/**
 * Check if user has permission to perform an action
 * @param {Object} team - The team object
 * @param {string} userId - The user ID to check
 * @param {string} permission - The permission to check ('view', 'edit', 'manage_members', 'delete')
 * @returns {boolean} True if user has the permission
 */
export const hasPermission = (team, userId, permission) => {
  if (!team || !userId) return false;

  // Owner has all permissions
  if (isTeamOwner(team, userId)) return true;

  // Check specific permissions
  const userRole = getUserRole(team, userId);

  if (!userRole) return false;

  switch (permission) {
    case 'view':
      // All members can view
      return true;
    case 'edit':
      // Admins can edit team details
      return userRole === 'admin';
    case 'manage_members':
      // Admins can manage members
      return userRole === 'admin';
    case 'delete':
      // Only owner can delete
      return isTeamOwner(team, userId);
    default:
      return false;
  }
};

/**
 * Format team member count text
 * @param {number} count - The number of members
 * @returns {string} Formatted text
 */
export const formatMemberCount = (count) => {
  if (count === 0) return 'No members';
  if (count === 1) return '1 member';
  return `${count} members`;
};

/**
 * Get avatar colors for team
 * @param {string} teamName - The team name
 * @returns {Object} Background and text colors for avatar
 */
export const getTeamAvatarColors = (teamName) => {
  if (!teamName) {
    return { bg: '#4B94FF', text: '#FFFFFF' };
  }

  // Generate a consistent color based on team name
  const colors = [
    { bg: '#4B94FF', text: '#FFFFFF' }, // Primary blue
    { bg: '#10B981', text: '#FFFFFF' }, // Success green
    { bg: '#F59E0B', text: '#FFFFFF' }, // Warning yellow
    { bg: '#EF4444', text: '#FFFFFF' }, // Error red
    { bg: '#8B5CF6', text: '#FFFFFF' }, // Purple
    { bg: '#EC4899', text: '#FFFFFF' }, // Pink
    { bg: '#6366F1', text: '#FFFFFF' }, // Indigo
    { bg: '#3B82F6', text: '#FFFFFF' }  // Blue
  ];

  const charCodeSum = teamName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const colorIndex = charCodeSum % colors.length;

  return colors[colorIndex];
};

export default {
  isTeamMember,
  isTeamOwner,
  isTeamAdmin,
  getUserRole,
  hasPermission,
  formatMemberCount,
  getTeamAvatarColors
};