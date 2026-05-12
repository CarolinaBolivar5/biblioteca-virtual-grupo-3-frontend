import { createBrowserRouter, Navigate } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';

import PublicLayout from '../components/PublicLayout';
import AdminLayout from '../components/AdminLayout';

// Públicas
import Home from '../pages/Home';
import Catalog from '../pages/Catalog';
import BlogPage from '../pages/BlogPage';
import BookDetail from '../pages/BookDetail';

import Login from '../pages/login/Login';
import Register from '../pages/register/Register';

// Usuario
import UserProfile from '../pages/UserProfile';
import PostPage from '../pages/PostPage';
import CreatePostPage from '../pages/CreatePostPage';

// Admin
import Dashboard from '../pages/admin/Dashboard';
import AdminProfile from '../pages/admin/AdminProfile';
import AdminLoans from '../pages/admin/AdminLoans';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminBooks from '../pages/admin/AdminBooks';
import AdminCategories from '../pages/admin/AdminCategories';
import AdminReturns from '../pages/admin/AdminReturns';

// Error
import NotFound from '../pages/NotFound';

const appRouter = createBrowserRouter([
  // =========================
  // PUBLIC LAYOUT
  // =========================
  {
    element: <PublicLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },

      {
        path: '/catalog',
        element: <Catalog />,
      },

      {
        path: '/blog',
        element: <BlogPage />,
      },

      {
        path: '/detalle/:id',
        element: <BookDetail />,
      },

      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },

  // =========================
  // AUTH
  // =========================
  {
    path: '/login',
    element: <Login />,
  },

  {
    path: '/register',
    element: <Register />,
  },

  // =========================
  // USER
  // =========================
  {
    path: '/perfil',
    element: (
      <PrivateRoute>
        <UserProfile />
      </PrivateRoute>
    ),
  },

 {
    path: '/post/:slug',
    element: (
      <PrivateRoute>
        <PostPage />
      </PrivateRoute>
    ),
  },

  {
    path: '/crear-post',
    element: (
      <PrivateRoute>
        <CreatePostPage />
      </PrivateRoute>
    ),
  },

  // =========================
  // ADMIN
  // =========================
  {
    path: '/admin',
    element: (
      <PrivateRoute>
        <AdminLayout />
      </PrivateRoute>
    ),

    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },

      {
        path: 'dashboard',
        element: <Dashboard />,
      },

      {
       path: 'perfil',
        element: <AdminProfile />,
      },

      {
        path: 'catalogo',
        element: <AdminBooks />,
      },

      {
        path: 'categorias',
        element: <AdminCategories />,
      },

      {
        path: 'usuarios',
        element: <AdminUsers />,
      },

      {
        path: 'prestamos',
        element: <AdminLoans />,
      },

      {
        path: 'devoluciones',
        element: <AdminReturns />,
      },
    ],
  },
]);

export default appRouter;