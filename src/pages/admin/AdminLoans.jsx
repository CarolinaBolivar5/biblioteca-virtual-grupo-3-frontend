import React, { useEffect, useMemo, useState } from 'react';
import { getPrestamos } from '../../services/api';

const getNombreUsuario = (prestamo) => {
    const perfil = prestamo?.perfil;
    const nombre = [perfil?.nombre, perfil?.apellido].filter(Boolean).join(' ').trim();
    return nombre || perfil?.email || 'Usuario sin nombre';
};

const getNombreLibro = (prestamo) => {
    return prestamo?.libro?.nombreLibro || prestamo?.libro?.titulo || prestamo?.libro?.googleId || 'Libro sin titulo';
};

const formatDate = (value) => {
    if (!value) return '-';
    const [date] = String(value).split('T');
    return date || '-';
};

const addDays = (date, days) => {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + days);
    return nextDate;
};

const toLocalDate = (value) => {
    if (!value) return null;
    const [date] = String(value).split('T');
    const parsed = new Date(`${date}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getLoanStatus = (prestamo) => {
    const estadoBackend = String(prestamo?.estado || '');
    const normalized = estadoBackend.toLowerCase();

    if (normalized.includes('devuelto') || normalized.includes('entregado')) {
        return {
            label: 'Devuelto',
            className: 'badge bg-success',
            dueDate: toLocalDate(prestamo.fechaDevolucion),
        };
    }

    const fechaPrestamo = toLocalDate(prestamo?.fechaPrestamo);
    const dueDate = fechaPrestamo ? addDays(fechaPrestamo, 7) : toLocalDate(prestamo?.fechaDevolucion);

    if (!dueDate) {
        return {
            label: estadoBackend || 'Sin estado',
            className: 'badge bg-secondary',
            dueDate: null,
        };
    }

    const today = toLocalDate(new Date().toISOString());
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / 86400000);

    if (diffDays < 0) {
        return {
            label: 'Vencido',
            className: 'badge bg-danger',
            dueDate,
        };
    }

    if (diffDays <= 2) {
        return {
            label: 'Proximo a vencer',
            className: 'badge bg-warning text-dark',
            dueDate,
        };
    }

    return {
        label: estadoBackend || 'Vigente',
        className: 'badge bg-success',
        dueDate,
    };
};

const formatDateFromDate = (date) => {
    if (!date) return '-';
    return date.toISOString().slice(0, 10);
};

const AdminLoans = () => {
    const [prestamos, setPrestamos] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        const loadPrestamos = async () => {
            try {
                setLoading(true);
                setError('');

                const data = await getPrestamos();

                if (!cancelled) {
                    setPrestamos(data);
                }
            } catch (err) {
                console.error('Error al consultar prestamos:', err);
                if (!cancelled) {
                    setPrestamos([]);
                    setError(err.message || 'No se pudieron cargar los prestamos.');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void loadPrestamos();

        return () => {
            cancelled = true;
        };
    }, []);

    const filteredPrestamos = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return prestamos;

        return prestamos.filter((prestamo) => {
            const values = [
                prestamo.id,
                getNombreLibro(prestamo),
                getNombreUsuario(prestamo),
                prestamo.estado,
                prestamo.fechaPrestamo,
                prestamo.fechaDevolucion,
                getLoanStatus(prestamo).label,
            ];

            return values.some((value) => String(value ?? '').toLowerCase().includes(query));
        });
    }, [prestamos, search]);

    return (
        <>
            <div className="header-content">
                <div>
                    <h1>Solicitudes de prestamo</h1>
                    <p className="breadcrumb">Home / Principal / Solicitudes de prestamo</p>
                </div>
            </div>

            <div className="table-container">
                <div className="table-actions">
                    <div className="search-input">
                        <i className="fas fa-search search-icon"></i>
                        <input
                            type="search"
                            placeholder="Buscar por libro o usuario..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </div>
                </div>

                {error && <div className="alert alert-danger mb-3">{error}</div>}

                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Libro</th>
                            <th>Usuario</th>
                            <th>Fecha prestamo</th>
                            <th>Vencimiento</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center">Cargando prestamos...</td>
                            </tr>
                        ) : filteredPrestamos.length > 0 ? (
                            filteredPrestamos.map((prestamo) => {
                                const loanStatus = getLoanStatus(prestamo);

                                return (
                                    <tr key={prestamo.id}>
                                        <td>#{prestamo.id}</td>
                                        <td>{getNombreLibro(prestamo)}</td>
                                        <td>{getNombreUsuario(prestamo)}</td>
                                        <td>{formatDate(prestamo.fechaPrestamo)}</td>
                                        <td>{formatDateFromDate(loanStatus.dueDate)}</td>
                                        <td><span className={loanStatus.className}>{loanStatus.label}</span></td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No hay prestamos para mostrar.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default AdminLoans;
