// src/App.js

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './core/theme/ThemeProvider';
import { AuthProvider } from './features/auth/context/AuthContext';
import AppRoutes from './core/routes/routes';
import MainLayout from './features/shared/layout/MainLayout';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <MainLayout>
            <AppRoutes />
          </MainLayout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;