import { endPoints } from '../../config/endPoints';
import { request } from './httpClient';

const normalizeBook = (libro) => ({
    id: libro.id,
    titulo: libro.nombreLibro || libro.titulo || 'Sin titulo',
    descripcion: libro.descripcion || 'Sin descripcion',
    disponible: libro.estado == null || libro.estado === 'disponible',
    autoresTexto: libro.autoresTexto,
    cantidadPaginas: libro.cantidadPaginas,
    googleId: libro.googleId,
    thumbnail: libro.thumbnail,
    categoria: libro.categoria,
});

const buildBookPayload = (libro) => ({
    nombreLibro: libro.nombreLibro,
    autoresTexto: libro.autoresTexto,
    cantidadPaginas: parseInt(libro.cantidadPaginas, 10) || 0,
    descripcion: libro.descripcion,
    googleId: libro.googleId || null,
    thumbnail: libro.thumbnail || null,
    categoria: { id: Number(libro.categoriaId) },
});

export const getLibros = async () => {
    try {
        const data = await request(endPoints.libros);
        const libros = Array.isArray(data) ? data : data?.libros ?? data?.content ?? [];
        return Array.isArray(libros) ? libros.map(normalizeBook) : [];
    } catch (error) {
        console.error('Hubo un error en GET libros:', error);
        return [];
    }
};

export const crearLibro = (nuevoLibro) =>
    request(endPoints.libros, {
        method: 'POST',
        body: JSON.stringify(buildBookPayload(nuevoLibro)),
    });

export const eliminarLibro = async (id) => {
    await request(`${endPoints.libros}/${id}`, { method: 'DELETE' });
    return true;
};

export const actualizarLibro = (id, libroActualizado) =>
    request(`${endPoints.libros}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(buildBookPayload(libroActualizado)),
    });
