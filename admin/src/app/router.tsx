import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../lib/auth';

// Layout
import { AppLayout } from '../components/layout/AppLayout';

// Loading component
const PageLoading = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
  </div>
);

// Lazy load pages
const LoginPage = lazy(() => import('../features/auth/LoginPage'));
const DashboardPage = lazy(() => import('../features/dashboard/DashboardPage'));
const UsersPage = lazy(() => import('../features/users/UsersPage'));
const EventsPage = lazy(() => import('../features/events/EventsPage'));
const PostsPage = lazy(() => import('../features/posts/PostsPage'));
const ScholarsPage = lazy(() => import('../features/scholars/ScholarsPage'));
const NotificationsPage = lazy(() => import('../features/notifications/NotificationsPage'));
const DonationsPage = lazy(() => import('../features/donations/DonationsPage'));
const ContentPage = lazy(() => import('../features/content/ContentPage'));
const NewsPage = lazy(() => import('../features/news/NewsPage'));
const SettingsPage = lazy(() => import('../features/settings/SettingsPage'));
const MakkahLivePage = lazy(() => import('../features/makkah-live/MakkahLivePage'));

// Protected Route wrapper
function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppLayout>
      <Suspense fallback={<PageLoading />}>
        <Outlet />
      </Suspense>
    </AppLayout>
  );
}

// Public Route wrapper (redirects to dashboard if already logged in)
function PublicRoute() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Suspense fallback={<PageLoading />}>
      <Outlet />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <PublicRoute />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
      {
        path: 'events',
        element: <EventsPage />,
      },
      {
        path: 'posts',
        element: <PostsPage />,
      },
      {
        path: 'scholars',
        element: <ScholarsPage />,
      },
      {
        path: 'notifications',
        element: <NotificationsPage />,
      },
      {
        path: 'donations',
        element: <DonationsPage />,
      },
      {
        path: 'content',
        element: <ContentPage />,
      },
      {
        path: 'news',
        element: <NewsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'makkah-live',
        element: <MakkahLivePage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

