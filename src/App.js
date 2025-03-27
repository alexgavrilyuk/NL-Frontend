// src/App.js

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './core/theme/ThemeProvider';
import { AuthProvider } from './features/auth/context/AuthContext';
import { DatasetProvider } from './features/datasets/context/DatasetContext';
import { PromptProvider } from './features/prompt/context/PromptContext';
import AppRoutes from './core/routes/routes';
import MainLayout from './features/shared/layout/MainLayout';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DatasetProvider>
          <PromptProvider>
            <Router>
              <MainLayout>
                <AppRoutes />
              </MainLayout>
            </Router>
          </PromptProvider>
        </DatasetProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;