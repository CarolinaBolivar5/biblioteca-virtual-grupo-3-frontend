import { endPoints } from '../../config/endPoints';
import { request } from './httpClient';

export const normalizePrestamos = (data) => {
    const list = Array.isArray(data) ? data : data?.prestamos ?? data?.content ?? data?.data ?? [];
    return Array.isArray(list) ? list : [];
};

export const getPrestamoById = (id) => request(endPoints.prestamoPorId(id));

export const devolverPrestamo = async (prestamoId, observaciones) => {
  const prestamo = await getPrestamoById(prestamoId);
  const payload = {
    ...prestamo,
    estado: 'Devuelto',
    ...(observaciones ? { observaciones } : {}),
  };
  return request(endPoints.prestamoPorId(prestamoId), {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};

export const getPrestamos = async () => normalizePrestamos(await request(endPoints.prestamos));
