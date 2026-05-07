import { createBrowserRouter, Navigate } from 'react-router-dom';

import AdminLayout from '../components/AdminLayout';
import PublicLayout from '../components/PublicLayout';

import Login from '../pages/Login';
import Register from '../pages/Register';

import AdminBooks from '../pages/admin/AdminBooks';
import AdminCategories from '../pages/admin/AdminCategories';
import AdminLoans from '../pages/admin/AdminLoans';
import AdminProfile from '../pages/admin/AdminProfile';
import AdminReturns from '../pages/admin/AdminReturns';
import AdminUsers from '../pages/admin/AdminUsers';
import Dashboard from '../pages/admin/Dashboard';

import Catalog from '../pages/public/Catalog';
import Home from '../pages/public/Home';

const appRouter = createBrowserRouter([
    {
        path: '/',
        element: <PublicLayout />,
        children: [
            { index: true, element: <Home /> },
            { path: 'catalog', element: <Catalog /> },
        ],
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
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
            { path: 'estudiantes', element: <Navigate to="../usuarios" replace /> },
            { path: 'registro-estudiantes', element: <Navigate to="../usuarios" replace /> },
            { path: 'prestamos', element: <AdminLoans /> },
            { path: 'devoluciones', element: <AdminReturns /> },
            { path: 'registro-devoluciones', element: <Navigate to="../devoluciones" replace /> },
        ],
    },
    {
        path: '*',
        element: <PublicLayout />,
        children: [
            { index: true, element: <h2 className="text-center mt-5">404 - Pagina No Encontrada</h2> },
        ],
    },
]);

export default appRouter;
