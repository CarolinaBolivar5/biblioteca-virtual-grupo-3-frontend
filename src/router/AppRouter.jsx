import { createBrowserRouter, Navigate } from 'react-router-dom';

import AdminLayout from '../components/AdminLayout';

import Home from '../pages/public/Home';
import Catalog from '../pages/public/Catalog';
import Login from '../pages/Login';
import Register from '../pages/Register';

import Dashboard from '../pages/admin/Dashboard';
import AdminPerfil from '../pages/admin/AdminPerfil';
import AdminCategorias from '../pages/admin/AdminCategorias';
import AdminRegistroCategorias from '../pages/admin/AdminRegistroCategorias';
import AdminPrestamos from '../pages/admin/AdminPrestamos';
import AdminDevoluciones from '../pages/admin/AdminDevoluciones';
import AdminRegistroDevoluciones from '../pages/admin/AdminRegistroDevoluciones';
import AdminUsuario from '../pages/admin/AdminUsuario';
import AdminRegistroUsuario from '../pages/admin/AdminRegistroUsuario';
import AdminCatalogo from '../pages/admin/AdminCatalogo';
import AdminRegistroLibros from '../pages/admin/AdminRegistroLibros';

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
            { path: 'perfil', element: <AdminPerfil /> },
            { path: 'catalogo', element: <AdminCatalogo /> },
            { path: 'registro-libros', element: <AdminRegistroLibros /> },
            { path: 'categorias', element: <AdminCategorias /> },
            { path: 'registro-categorias', element: <AdminRegistroCategorias /> },
            { path: 'usuarios', element: <AdminUsuario /> },
            { path: 'registro-usuario', element: <AdminRegistroUsuario /> },
            { path: 'prestamos', element: <AdminPrestamos /> },
            { path: 'devoluciones', element: <AdminDevoluciones /> },
            { path: 'registro-devoluciones', element: <AdminRegistroDevoluciones /> },
        ]
    },
    {
        path: '*',
        element: <PublicLayout><h2 className="text-center mt-5">404 - Página No Encontrada</h2></PublicLayout>
    }
]);

export default appRouter;
