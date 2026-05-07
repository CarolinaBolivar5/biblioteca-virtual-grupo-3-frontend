import { endPoints } from '../../config/endPoints';
import { request } from './httpClient';

export const normalizeUsers = (data) => {
    const list = Array.isArray(data) ? data : data?.usuarios ?? data?.content ?? data?.data ?? [];
    return Array.isArray(list) ? list : [];
};

export const getUsuarios = async () => normalizeUsers(await request(endPoints.usuarios));

export const getUsuarioPorId = (id) => request(endPoints.usuarioPorId(id));

export const getPerfilPorId = (id) => request(endPoints.perfilPorId(id));

export const getRoles = async () => {
    const data = await request(endPoints.roles);
    const list = Array.isArray(data) ? data : data?.roles ?? data?.content ?? data?.data ?? [];
    return Array.isArray(list) ? list : [];
};

export const createPerfil = (perfil) =>
    request(endPoints.perfiles, {
        method: 'POST',
        body: JSON.stringify(perfil),
    });

export const createUsuario = (usuario) =>
    request(endPoints.usuarios, {
        method: 'POST',
        body: JSON.stringify(usuario),
    });

export const getRoleIdByName = (roles, name) => {
    const target = name.trim().toUpperCase();
    const role = roles.find((item) => String(item.descripcion || '').trim().toUpperCase() === target);
    return typeof role?.id === 'number' ? role.id : null;
};
