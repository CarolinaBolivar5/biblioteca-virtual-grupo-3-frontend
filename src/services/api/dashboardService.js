import { getCategorias } from './categoriesService';
import { getLibros } from './booksService';
import { getPrestamos } from './loansService';
import { getUsuarios } from './usersService';

const getNombreUsuario = (prestamo) =>
    [prestamo?.perfil?.nombre, prestamo?.perfil?.apellido].filter(Boolean).join(' ') || 'Sin usuario';

const getNombreLibro = (prestamo) =>
    prestamo?.libro?.nombreLibro || prestamo?.libro?.titulo || prestamo?.libro?.googleId || 'Libro sin titulo';

export async function fetchDashboardStats() {
    const [libros, usuarios, prestamos, categorias] = await Promise.all([
        getLibros(),
        getUsuarios(),
        getPrestamos(),
        getCategorias(),
    ]);

    return {
        totalLibros: libros.length,
        totalUsuarios: usuarios.length,
        totalPrestamos: prestamos.length,
        totalCategorias: categorias.length,
        totalProfesores: usuarios.filter((usuario) =>
            String(usuario?.rol?.descripcion || '').toLowerCase().includes('profesor')
        ).length,
        totalDevoluciones: prestamos.filter((prestamo) =>
            String(prestamo?.estado || '').toLowerCase().includes('devuelto')
        ).length,
    };
}

export async function fetchUltimosPrestamos(limit = 5) {
    const prestamos = await getPrestamos();
    return prestamos.slice(0, limit).map((prestamo) => ({
        id: prestamo.id,
        fechaPrestamo: prestamo.fechaPrestamo ?? 'Sin fecha',
        libroTitulo: getNombreLibro(prestamo),
        estudianteNombre: getNombreUsuario(prestamo),
        fechaDevolucion: prestamo.fechaDevolucion ?? 'Sin fecha',
        estado: prestamo.estado ?? 'Sin estado',
    }));
}
