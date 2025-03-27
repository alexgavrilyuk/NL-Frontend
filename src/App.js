// src/App.js

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './core/theme/ThemeProvider';
import AppRoutes from './core/routes/routes';
import MainLayout from './features/shared/layout/MainLayout';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;