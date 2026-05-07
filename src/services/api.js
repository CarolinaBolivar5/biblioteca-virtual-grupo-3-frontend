/** HU07: URL base y rutas de API centralizadas (sin magic strings en la lógica de fetch) */
import { endPoints } from '../config/endPoints';
export const BASE_URL = 'https://biblioteca-virtual-grupo-3.onrender.com';

export const ENDPOINTS = {
    POSTS: '/posts',
    USERS: '/users',
    TODOS: '/todos',
    ALBUMS: '/albums',
    COMMENTS: '/comments',
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchJson(path) {
    const response = await fetch(`${BASE_URL}${path}`);
    if (!response.ok) throw new Error('Error en la respuesta del servidor');
    return response.json();
}

/**
 * HU07/HU08: resumen del panel — varias peticiones GET usando ENDPOINTS
 */
export async function fetchDashboardStats() {
    const [posts, users, todos, albums] = await Promise.all([
        fetchJson(ENDPOINTS.POSTS),
        fetchJson(ENDPOINTS.USERS),
        fetchJson(ENDPOINTS.TODOS),
        fetchJson(ENDPOINTS.ALBUMS),
    ]);

    const profesores = users.filter((u) => u.id > 5).length;

    return {
        totalLibros: posts.length,
        totalEstudiantes: users.length,
        totalPrestamos: todos.length,
        totalCategorias: albums.length,
        totalProfesores: profesores,
        totalDevoluciones: todos.filter((t) => t.completed).length,
    };
}

/**
 * Últimos préstamos: combina todos + posts + users (GET)
 */
export async function fetchUltimosPrestamos(limit = 5) {
    const [todos, posts, users] = await Promise.all([
        fetchJson(`${ENDPOINTS.TODOS}?_limit=${limit}`),
        fetchJson(`${ENDPOINTS.POSTS}?_limit=${limit}`),
        fetchJson(ENDPOINTS.USERS),
    ]);

    return todos.map((t, i) => {
        const post = posts[i] || posts[0];
        const user = users[i % users.length];
        const dia = String(30 - i).padStart(2, '0');
        const diaDev = String(15 - i).padStart(2, '0');
        return {
            id: t.id,
            fechaPrestamo: `2025-05-${dia}`,
            libroTitulo: post?.title?.replace(/\n/g, ' ') ?? 'Libro',
            estudianteNombre: user?.name ?? 'Estudiante',
            fechaDevolucion: `2025-06-${diaDev}`,
            estado: t.completed ? 'Vencido' : 'Activo',
        };
    });
}

export const getLibros = async () => {
    try {
        const response = await fetch(endPoints.libros);
        if (!response.ok) throw new Error('Error en la respuesta del servidor');
        const data = await response.json();
        return data.map(libro => ({
            id: libro.id,
            titulo: libro.nombreLibro,
            descripcion: libro.descripcion || 'Sin descripción',
            disponible: libro.estado === null || libro.estado === 'disponible',
            autoresTexto: libro.autoresTexto,
            cantidadPaginas: libro.cantidadPaginas,
            googleId: libro.googleId,
            thumbnail: libro.thumbnail,
            categoria: libro.categoria
        }));
    } catch (error) {
        console.error('Hubo un error en GET libros:', error);
        return [];
    }
};

export const crearLibro = async (nuevoLibro) => {
    try {
        const response = await fetch(endPoints.libros, {
            method: 'POST',
            body: JSON.stringify({
                nombreLibro: nuevoLibro.nombreLibro,
                autoresTexto: nuevoLibro.autoresTexto,
                cantidadPaginas: parseInt(nuevoLibro.cantidadPaginas) || 0,
                descripcion: nuevoLibro.descripcion,
                googleId: nuevoLibro.googleId || null,
                thumbnail: nuevoLibro.thumbnail || null,
                categoria: { id: nuevoLibro.categoriaId }
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        if (!response.ok) throw new Error('Fallo al crear recurso');
        return await response.json();
    } catch (error) {
        console.error('Hubo un error en POST libro:', error);
        throw error;
    }
};

export const eliminarLibro = async (id) => {
    try {
        const response = await fetch(`${endPoints.libros}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Fallo al eliminar libro');
        return true;
    } catch (error) {
        console.error('Hubo un error en DELETE libro:', error);
        throw error;
    }
};

export const actualizarLibro = async (id, libroActualizado) => {
    try {
        const response = await fetch(`${endPoints.libros}/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                nombreLibro: libroActualizado.nombreLibro,
                autoresTexto: libroActualizado.autoresTexto,
                cantidadPaginas: parseInt(libroActualizado.cantidadPaginas) || 0,
                descripcion: libroActualizado.descripcion,
                googleId: libroActualizado.googleId || null,
                thumbnail: libroActualizado.thumbnail || null,
                categoria: { id: libroActualizado.categoriaId }
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        if (!response.ok) throw new Error('Fallo al actualizar libro');
        return await response.json();
    } catch (error) {
        console.error('Hubo un error en PUT libro:', error);
        throw error;
    }
};

export const crearUsuario = async (nuevoUsuario) => {
    try {
        const response = await fetch(endPoints.usuarios, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                email: nuevoUsuario.email,
                password: nuevoUsuario.password,
                perfil: {
                    nombre: nuevoUsuario.nombres,
                    apellido: nuevoUsuario.apellidos,
                    numeroDocumento: nuevoUsuario.numeroDocumento,
                    tipoDocumento: nuevoUsuario.tipoDocumento,
                    telefono: nuevoUsuario.telefono || null,
                    direccion: nuevoUsuario.direccion || null,
                },
                rol: {
                    id: parseInt(nuevoUsuario.rolId, 10),
                },
            }),
        });
        if (!response.ok) throw new Error('Fallo al crear usuario');
        return await response.json();
    } catch (error) {
        console.error('Hubo un error en POST usuario:', error);
        throw error;
    }
};

export const getUsuarios = async () => {
    try {
        console.log('Calling getUsuarios...');
        const response = await fetch(endPoints.usuarios);
        console.log('Response status:', response.status);
        if (!response.ok) throw new Error('Error en la respuesta del servidor');
        const data = await response.json();
        console.log('Usuarios fetched:', data);
        return data;
    } catch (error) {
        console.error('Hubo un error en GET usuarios:', error);
        return [];
    }
};
