const API_URL = 'https://biblioteca-virtual-grupo-3.onrender.com';
const base = (import.meta.env.VITE_API_URL || API_URL).replace(/\/$/, '');

const withBase = (path) => `${base}${path}`;

export const endPoints = {
  usuarios: withBase('/usuarios'),
  usuarioPorId: (id) => withBase(`/usuarios/${encodeURIComponent(id)}`),
  perfiles: withBase('/perfiles'),
  perfilPorId: (id) => withBase(`/perfiles/${encodeURIComponent(id)}`),
  roles: withBase('/roles'),
  prestamos: withBase('/prestamos'),
  libros: withBase('/api/libros'),
};
