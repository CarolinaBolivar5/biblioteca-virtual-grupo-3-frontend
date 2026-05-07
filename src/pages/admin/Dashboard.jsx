import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { fetchDashboardStats, fetchUltimosPrestamos } from '../../services/api';

const initialStats = {
    totalLibros: 0,
    totalUsuarios: 0,
    totalPrestamos: 0,
    totalCategorias: 0,
    totalProfesores: 0,
    totalDevoluciones: 0,
};

const Dashboard = () => {
    const [stats, setStats] = useState(initialStats);
    const [prestamos, setPrestamos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const cargar = async () => {
            setLoading(true);
            try {
                const [resumen, ultimos] = await Promise.all([
                    fetchDashboardStats(),
                    fetchUltimosPrestamos(5),
                ]);
                if (!cancelled) {
                    setStats(resumen);
                    setPrestamos(ultimos);
                }
            } catch {
                if (!cancelled) {
                    Swal.fire({
                        title: 'Error al cargar el panel',
                        text: 'No se pudieron obtener los datos del servidor.',
                        icon: 'error',
                    });
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        cargar();
        return () => {
            cancelled = true;
        };
    }, []);

    const badgeClass = (estado) =>
        estado === 'Activo' ? 'badge bg-success' : 'badge bg-danger';

    return (
        <>
            <div className="header-content">
                <div>
                    <h1>Dashboard</h1>
                    <p className="breadcrumb">Home / Dashboard</p>
                </div>
            </div>

            <div className="dashboard-cards">
                <div className="card card-primary">
                    <div className="card-icon">
                        <i className="fas fa-book" aria-hidden />
                    </div>
                    <div className="card-content">
                        <div className="card-value">{loading ? '…' : stats.totalLibros}</div>
                        <div className="card-title">Total Libros</div>
                    </div>
                </div>
                <div className="card card-success">
                    <div className="card-icon">
                        <i className="fas fa-user-graduate" aria-hidden />
                    </div>
                    <div className="card-content">
                        <div className="card-value">{loading ? '…' : stats.totalUsuarios}</div>
                        <div className="card-title">Total Usuarios</div>
                    </div>
                </div>
                <div className="card card-warning">
                    <div className="card-icon">
                        <i className="fas fa-handshake" aria-hidden />
                    </div>
                    <div className="card-content">
                        <div className="card-value">{loading ? '…' : stats.totalPrestamos}</div>
                        <div className="card-title">Total Préstamos</div>
                    </div>
                </div>
                <div className="card card-info">
                    <div className="card-icon">
                        <i className="fas fa-bookmark" aria-hidden />
                    </div>
                    <div className="card-content">
                        <div className="card-value">{loading ? '…' : stats.totalCategorias}</div>
                        <div className="card-title">Total Categorías</div>
                    </div>
                </div>
                <div className="card card-danger">
                    <div className="card-icon">
                        <i className="fas fa-chalkboard-teacher" aria-hidden />
                    </div>
                    <div className="card-content">
                        <div className="card-value">{loading ? '…' : stats.totalProfesores}</div>
                        <div className="card-title">Total Profesores</div>
                    </div>
                </div>
                <div className="card card-secondary">
                    <div className="card-icon">
                        <i className="fas fa-undo" aria-hidden />
                    </div>
                    <div className="card-content">
                        <div className="card-value">{loading ? '…' : stats.totalDevoluciones}</div>
                        <div className="card-title">Total Devoluciones</div>
                    </div>
                </div>
            </div>

            <div className="table-container mt-4">
                <h3>Últimos Préstamos</h3>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Fecha Préstamo</th>
                            <th>Libro</th>
                            <th>Estudiante</th>
                            <th>Fecha Devolución</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5}>Cargando préstamos…</td>
                            </tr>
                        ) : (
                            prestamos.map((row) => (
                                <tr key={row.id}>
                                    <td>{row.fechaPrestamo}</td>
                                    <td>{row.libroTitulo}</td>
                                    <td>{row.estudianteNombre}</td>
                                    <td>{row.fechaDevolucion}</td>
                                    <td>
                                        <span className={badgeClass(row.estado)}>{row.estado}</span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Dashboard;
