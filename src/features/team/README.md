# Team Management Feature

The Team Management feature enables users to create and manage teams, invite colleagues, and collaborate on shared datasets and reports.

## Key Components

### Context

- **TeamContext**: Provides state management and operations for teams throughout the application.

### Pages

- **TeamsPage**: Lists all teams and pending invitations.
- **TeamDetailPage**: Displays detailed information about a specific team.
- **CreateTeamPage**: Form for creating a new team.

### Components

- **TeamList**: Displays a list of teams the user belongs to.
- **TeamDetail**: Shows detailed information about a team.
- **MemberManagement**: Manages team members.
- **InvitationForm**: Form for inviting new members to a team.
- **InvitationList**: Lists pending invitations for a team.
- **MyInvitations**: Displays invitations the current user has received.
- **CreateTeamForm**: Form for creating a new team.

## API Endpoints

The team feature interacts with the following backend endpoints:

- `GET /teams`: Fetch all teams for the current user
- `GET /teams/:id`: Fetch a specific team
- `POST /teams`: Create a new team
- `PUT /teams/:id`: Update a team
- `DELETE /teams/:id`: Delete a team
- `POST /teams/:id/members`: Add a member to a team
- `DELETE /teams/:id/members/:userId`: Remove a member from a team
- `POST /teams/:id/invite`: Send an invitation to join a team
- `GET /teams/invitations`: Get pending invitations for the current user
- `POST /teams/invitations/:id/accept`: Accept a team invitation
- `POST /teams/invitations/:id/decline`: Decline a team invitation

## User Roles and Permissions

The team feature supports the following roles with different permissions:

- **Owner**: Can manage all aspects of the team, including editing details, managing members, and deleting the team.
- **Admin**: Can manage team details and members, but cannot delete the team.
- **Member**: Can access team resources but cannot modify team settings or manage members.

## Team Context Settings

Teams can have context settings that provide the AI with information about the team's business needs:

- Business Type (e.g., Financial Services, Retail)
- Industry (e.g., Banking, Apparel)
- Fiscal Year Start
- Reporting Currency

These settings are used by the AI when generating reports to provide more context-aware insights.

## Integration with Other Features

The Team feature integrates with:

- **Dataset Management**: Teams can have shared datasets accessible to all members.
- **Prompt Interface**: Team context is used when generating AI reports.
- **Reporting**: Team members can view and export shared reports.

## Implementation Notes

- Team membership is checked throughout the application to control access to shared resources.
- Team context settings are passed to the AI along with dataset information to improve report accuracy.
- Invitations are managed through a separate API endpoint and have their own state management.
- The UI provides clear indications of which resources are team-owned vs. personal.