import { getLibros } from './booksService';
import { getPrestamos } from './loansService';
import { getUsuarios } from './usersService';

export async function fetchDashboardStats() {
    const [libros, usuarios, prestamos] = await Promise.all([
        getLibros(),
        getUsuarios(),
        getPrestamos(),
    ]);

    const categorias = new Set(
        libros
            .map((libro) => libro.categoria?.id || libro.categoria?.nombre || libro.categoria)
            .filter(Boolean),
    );

    return {
        totalLibros: libros.length,
        totalUsuarios: usuarios.length,
        totalPrestamos: prestamos.length,
        totalCategorias: categorias.size,
        totalProfesores: usuarios.filter((usuario) => {
            const rol = usuario.rol?.descripcion || usuario.rolDescripcion || usuario.rol || '';
            return String(rol).toUpperCase().includes('PROFESOR');
        }).length,
        totalDevoluciones: prestamos.filter((prestamo) => {
            const estado = String(prestamo.estado || '').toLowerCase();
            return estado.includes('devuelto') || estado.includes('entregado');
        }).length,
    };
}

export async function fetchUltimosPrestamos(limit = 5) {
    const prestamos = await getPrestamos();

    return prestamos.slice(0, limit).map((prestamo) => {
        const perfil = prestamo.perfil ?? {};
        const libro = prestamo.libro ?? {};
        const estudianteNombre = [perfil.nombre, perfil.apellido].filter(Boolean).join(' ').trim();

        return {
            id: prestamo.id,
            fechaPrestamo: prestamo.fechaPrestamo || '-',
            libroTitulo: libro.nombreLibro || libro.titulo || 'Libro sin titulo',
            estudianteNombre: estudianteNombre || perfil.email || 'Usuario sin nombre',
            fechaDevolucion: prestamo.fechaDevolucion || '-',
            estado: prestamo.estado || 'Sin estado',
        };
    });
}
