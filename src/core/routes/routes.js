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
import ReportsListPage from '../../features/reporting/pages/ReportsListPage';
import ReportPage from '../../features/reporting/pages/ReportPage';
import CreateReportPage from '../../features/reporting/pages/CreateReportPage';

// Public pages
const LoginPage = lazy(() => import('../../features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('../../features/auth/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../../features/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../../features/auth/pages/ResetPasswordPage'));

// Protected pages
const PromptPage = lazy(() => import('../../features/prompt/pages/PromptPage'));
const TeamsPage = lazy(() => import('../../features/team/pages/TeamsPage'));
const TeamDetailPage = lazy(() => import('../../features/team/pages/TeamDetailPage'));
const CreateTeamPage = lazy(() => import('../../features/team/pages/CreateTeamPage'));
const ProfilePage = lazy(() => import('../../features/account/pages/ProfilePage'));
const SettingsPage = lazy(() => import('../../features/account/pages/SettingsPage'));
const NotFoundPage = lazy(() => import('../../features/shared/layout/NotFoundPage'));

// Subscription pages
const PlansPage = lazy(() => import('../../features/subscription/pages/PlansPage'));
const SubscriptionManagementPage = lazy(() => import('../../features/subscription/pages/SubscriptionManagementPage'));

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
          element={currentUser ? <Navigate to="/prompt" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={currentUser ? <Navigate to="/prompt" replace /> : <RegisterPage />}
        />
        <Route
          path="/forgot-password"
          element={currentUser ? <Navigate to="/prompt" replace /> : <ForgotPasswordPage />}
        />
        <Route
          path="/reset-password"
          element={currentUser ? <Navigate to="/prompt" replace /> : <ResetPasswordPage />}
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
          path="/reports/new"
          element={
            <ProtectedRoute>
              <CreateReportPage />
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
          path="/team/new"
          element={
            <ProtectedRoute>
              <CreateTeamPage />
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

        {/* Subscription routes */}
        <Route
          path="/subscription/plans"
          element={
            <ProtectedRoute>
              <PlansPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscription/management"
          element={
            <ProtectedRoute>
              <SubscriptionManagementPage />
            </ProtectedRoute>
          }
        />

        {/* Redirect and 404 */}
        <Route path="/" element={<Navigate to={currentUser ? "/prompt" : "/login"} replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;