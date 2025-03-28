// src/App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './core/theme/ThemeProvider';
import { AuthProvider } from './features/auth/context/AuthContext';
import { SubscriptionProvider } from './features/subscription/context/SubscriptionContext';
import { DatasetProvider } from './features/datasets/context/DatasetContext';
import { PromptProvider } from './features/prompt/context/PromptContext';
import { ReportProvider } from './features/reporting/context/ReportContext';
import { TeamProvider } from './features/team/context/TeamContext';
import { AccountProvider } from './features/account/context/AccountContext';
import AppRoutes from './core/routes/routes';
import MainLayout from './features/shared/layout/MainLayout';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <AccountProvider>
            <TeamProvider>
              <DatasetProvider>
                <PromptProvider>
                  <ReportProvider>
                    <Router>
                      <MainLayout>
                        <AppRoutes />
                      </MainLayout>
                    </Router>
                  </ReportProvider>
                </PromptProvider>
              </DatasetProvider>
            </TeamProvider>
          </AccountProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;