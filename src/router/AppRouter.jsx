import { createBrowserRouter, Navigate } from 'react-router-dom';

import AdminLayout from '../components/AdminLayout';

import Home from '../pages/public/Home';
import Catalog from '../pages/public/Catalog';
import Login from '../pages/Login';
import Register from '../pages/Register';

import Dashboard from '../pages/admin/Dashboard';
import AdminProfile from '../pages/admin/AdminProfile';
import AdminLoans from '../pages/admin/AdminLoans';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminBooks from '../pages/admin/AdminBooks';
import AdminCategories from '../pages/admin/AdminCategories';
import AdminReturns from '../pages/admin/AdminReturns';

import PublicLayout from '../components/PublicLayout';

const appRouter = createBrowserRouter([
    {
        path: '/',
        element: <PublicLayout><Home /></PublicLayout>
    },
    {
        path: '/catalog',
        element: <PublicLayout><Catalog /></PublicLayout>
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            { index: true, element: <Navigate to="dashboard" replace /> },
            { path: 'dashboard', element: <Dashboard /> },
            { path: 'perfil', element: <AdminProfile /> },
            { path: 'catalogo', element: <AdminBooks /> },
            { path: 'registro-libros', element: <Navigate to="../catalogo" replace /> },
            { path: 'categorias', element: <AdminCategories /> },
            { path: 'registro-categorias', element: <Navigate to="../categorias" replace /> },
            { path: 'usuarios', element: <AdminUsers /> },
            { path: 'registro-usuario', element: <Navigate to="../usuarios" replace /> },
            { path: 'estudiantes', element: <Navigate to="../usuarios" replace /> },
            { path: 'registro-estudiantes', element: <Navigate to="../usuarios" replace /> },
            { path: 'prestamos', element: <AdminLoans /> },
            { path: 'devoluciones', element: <AdminReturns /> },
            { path: 'registro-devoluciones', element: <Navigate to="../devoluciones" replace /> },
        ]
    },
    {
        path: '*',
        element: <PublicLayout><h2 className="text-center mt-5">404 - Página No Encontrada</h2></PublicLayout>
    }
]);

export default appRouter;
