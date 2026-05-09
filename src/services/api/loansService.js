import { endPoints } from '../../config/endPoints';
import { request } from './httpClient';

export const normalizePrestamos = (data) => {
    const list = Array.isArray(data) ? data : data?.prestamos ?? data?.content ?? data?.data ?? [];
    return Array.isArray(list) ? list : [];
};

export const getPrestamos = async () => normalizePrestamos(await request(endPoints.prestamos));
