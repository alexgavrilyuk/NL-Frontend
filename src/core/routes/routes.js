// src/core/routes/routes.js

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Lazy-loaded page components
const LoginPage = lazy(() => import('../../features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('../../features/auth/pages/RegisterPage'));
const DashboardPage = lazy(() => import('../../features/dashboard/pages/DashboardPage'));
const NotFoundPage = lazy(() => import('../../features/shared/pages/NotFoundPage'));

// Loading component
const LoadingPage = () => (
  <div className="flex items-center justify-center min-h-screen bg-background-primary">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes will be added here */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Redirect and 404 */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;