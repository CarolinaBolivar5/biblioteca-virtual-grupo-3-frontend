import { endPoints } from '../../config/endPoints';
import { request } from './httpClient';

const normalizeCategory = (category, index) => {
    const backendId = category?.id ?? category?.categoriaId;
    return {
        id: backendId ?? index + 1,
        nombre: category?.nombre ?? category?.name ?? `Categoria ${index + 1}`,
        descripcion: category?.descripcion ?? category?.description ?? 'Sin descripcion',
        hasBackendId: backendId !== undefined && backendId !== null,
    };
};

export const normalizeCategorias = (data) => {
    const list = Array.isArray(data) ? data : data?.categorias ?? data?.content ?? data?.data ?? [];
    return Array.isArray(list) ? list.map(normalizeCategory) : [];
};

export const getCategorias = async () => normalizeCategorias(await request(endPoints.categorias));

export const crearCategoria = (categoria) =>
    request(endPoints.categorias, {
        method: 'POST',
        body: JSON.stringify({
            nombre: categoria.nombre,
            descripcion: categoria.descripcion,
        }),
    });
