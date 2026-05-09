import { endPoints } from '../../config/endPoints';
import { request } from './httpClient';

export const crearUsuario = (nuevoUsuario) =>
    request(endPoints.usuarios, {
        method: 'POST',
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

export const getUsuarios = async () => {
    const data = await request(endPoints.usuarios);
    return Array.isArray(data) ? data : [];
};

export const getUsuarioPorId = (id) => request(endPoints.usuarioPorId(id));

export const getPerfilPorId = (id) => request(endPoints.perfilPorId(id));
