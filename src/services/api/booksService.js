import { endPoints } from '../../config/endPoints';
import { request } from './httpClient';

const normalizeBook = (libro) => ({
    id: libro.id,
    titulo: libro.nombreLibro,
    descripcion: libro.descripcion || 'Sin descripcion',
    disponible: libro.estado === null || libro.estado === 'disponible',
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
    const data = await request(endPoints.libros);
    return Array.isArray(data) ? data.map(normalizeBook) : [];
};

export const crearLibro = (nuevoLibro) =>
    request(endPoints.libros, {
        method: 'POST',
        body: JSON.stringify(buildBookPayload(nuevoLibro)),
    });

export const eliminarLibro = (id) =>
    request(`${endPoints.libros}/${encodeURIComponent(id)}`, {
        method: 'DELETE',
    });

export const actualizarLibro = (id, libroActualizado) =>
    request(`${endPoints.libros}/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: JSON.stringify(buildBookPayload(libroActualizado)),
    });
