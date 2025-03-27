# Account Management Feature

The Account Management feature allows users to manage their personal profiles, application settings, and AI context preferences.

## Key Components

### Context

- **AccountContext**: Provides state management and operations for user account data throughout the application.

### Pages

- **ProfilePage**: Displays user profile information and security settings.
- **SettingsPage**: Manages application settings and AI context preferences.

### Components

- **ProfileForm**: Form for updating user profile information.
- **SettingsForm**: Form for managing application settings like language, currency, date formats, etc.
- **AIContextForm**: Form for configuring AI context preferences used in analysis.
- **ThemeSelector**: UI for selecting application theme (light/dark).
- **SecuritySettings**: Form for managing security settings like password updates.

## API Endpoints

The account feature interacts with the following backend endpoints:

- `GET /account/profile`: Fetch user profile information
- `PUT /account/profile`: Update user profile information
- `GET /account/settings`: Fetch user application settings
- `PUT /account/settings`: Update user application settings
- `GET /account/preferences`: Fetch user AI context preferences
- `PUT /account/preferences`: Update user AI context preferences
- `GET /account/onboarding`: Fetch user onboarding status
- `PUT /account/onboarding`: Update user onboarding status

## User Settings

The settings managed in this feature include:

### Application Settings

- **Theme**: Light or dark mode
- **Language**: Application language preference
- **Currency**: Preferred currency for financial data
- **Date Format**: Preferred date format (MM/DD/YYYY, DD/MM/YYYY, etc.)
- **Time Format**: 12-hour or 24-hour format
- **Notifications**: Email and in-app notification preferences

### AI Context Settings

- **Industry**: User's industry for contextual analysis
- **Business Type**: Type of business for tailored insights
- **Financial Year**: Financial year start/end dates
- **Reporting Period**: Preferred reporting period (monthly, quarterly, etc.)
- **Company Size**: Size of the company for contextual analysis
- **Analysis Preference**: Preferred level of detail in analysis

## Integration with Other Features

The Account Management feature integrates with:

- **Authentication**: Profile information is tied to the authenticated user.
- **Theme System**: Theme preferences are managed here.
- **Prompt Interface**: AI context settings affect how prompts are processed.
- **Reporting**: Settings impact the format and presentation of reports.

## Implementation Notes

- User settings are loaded when the user logs in and are available to all features.
- Settings are persisted to the backend to ensure consistency across devices.
- Theme changes are applied immediately to provide visual feedback.
- AI context settings are used to enhance the quality of AI-generated reports.