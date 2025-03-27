// src/core/routes/routes.js

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../../features/auth/context/AuthContext';
import Loading from '../../features/shared/ui/Loading';
import DatasetsPage from '../../features/datasets/pages/DatasetsPage';
import DatasetDetailPage from '../../features/datasets/pages/DatasetDetailPage';
import DatasetUploadPage from '../../features/datasets/pages/DatasetUploadPage';

// Public pages
const LoginPage = lazy(() => import('../../features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('../../features/auth/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../../features/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../../features/auth/pages/ResetPasswordPage'));

// Protected pages
const DashboardPage = lazy(() => import('../../features/dashboard/pages/DashboardPage'));
const PromptPage = lazy(() => import('../../features/prompt/pages/PromptPage'));
const ReportsListPage = lazy(() => import('../../features/reporting/pages/ReportsListPage'));
const ReportPage = lazy(() => import('../../features/reporting/pages/ReportPage'));
const TeamsPage = lazy(() => import('../../features/team/pages/TeamsPage'));
const TeamDetailPage = lazy(() => import('../../features/team/pages/TeamDetailPage'));
const ProfilePage = lazy(() => import('../../features/account/pages/ProfilePage'));
const SettingsPage = lazy(() => import('../../features/account/pages/SettingsPage'));
const NotFoundPage = lazy(() => import('../../features/shared/pages/NotFoundPage'));

// Loading component for suspense fallback
const LoadingPage = () => (
  <Loading fullPage text="Loading..." />
);

const AppRoutes = () => {
  const { currentUser } = useAuth();

  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={currentUser ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={currentUser ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
        />
        <Route
          path="/forgot-password"
          element={currentUser ? <Navigate to="/dashboard" replace /> : <ForgotPasswordPage />}
        />
        <Route
          path="/reset-password"
          element={currentUser ? <Navigate to="/dashboard" replace /> : <ResetPasswordPage />}
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Dataset routes */}
        <Route
          path="/datasets"
          element={
            <ProtectedRoute>
              <DatasetsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/datasets/:id"
          element={
            <ProtectedRoute>
              <DatasetDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Prompt route */}
        <Route
          path="/prompt"
          element={
            <ProtectedRoute>
              <PromptPage />
            </ProtectedRoute>
          }
        />

        {/* Report routes */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportsListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/:id"
          element={
            <ProtectedRoute>
              <ReportPage />
            </ProtectedRoute>
          }
        />

        {/* Team routes */}
        <Route
          path="/team"
          element={
            <ProtectedRoute>
              <TeamsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/team/:id"
          element={
            <ProtectedRoute>
              <TeamDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Account routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Dataset routes */}
        <Route
          path="/datasets"
          element={
            <ProtectedRoute>
              <DatasetsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/datasets/new"
          element={
            <ProtectedRoute>
              <DatasetUploadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/datasets/:id"
          element={
            <ProtectedRoute>
              <DatasetDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Redirect and 404 */}
        <Route path="/" element={<Navigate to={currentUser ? "/dashboard" : "/login"} replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;