import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { fetchDashboardStats, fetchUltimosPrestamos } from '../../services/api';
import '../../styles/admin/tables.css';
import '../../styles/admin/cards.css';
import '../../styles/admin/admin-pages.css';

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
        <div className="admin-page-container">
            <div className="admin-page-header">
                <h1>Dashboard Administrativo</h1>
                <p className="breadcrumb">Admin / Dashboard</p>
            </div>

            <div className="admin-stats-grid">
                <div className="card card-primary">
                    <div className="card-icon">
                        <i className="fas fa-book-open" aria-hidden />
                    </div>
                    <div className="card-content">
                        <div className="card-value">{loading ? '…' : stats.totalLibros}</div>
                        <div className="card-title">Total Libros</div>
                    </div>
                </div>
                <div className="card card-success">
                    <div className="card-icon">
                        <i className="fas fa-people-group" aria-hidden />
                    </div>
                    <div className="card-content">
                        <div className="card-value">{loading ? '…' : stats.totalUsuarios}</div>
                        <div className="card-title">Total Usuarios</div>
                    </div>
                </div>
                <div className="card card-warning">
                    <div className="card-icon">
                        <i className="fas fa-paper-plane" aria-hidden />
                    </div>
                    <div className="card-content">
                        <div className="card-value">{loading ? '…' : stats.totalPrestamos}</div>
                        <div className="card-title">Total Préstamos</div>
                    </div>
                </div>
                <div className="card card-info">
                    <div className="card-icon">
                        <i className="fas fa-layer-group" aria-hidden />
                    </div>
                    <div className="card-content">
                        <div className="card-value">{loading ? '…' : stats.totalCategorias}</div>
                        <div className="card-title">Total Categorías</div>
                    </div>
                </div>
                <div className="card card-danger">
                    <div className="card-icon">
                        <i className="fas fa-chalkboard" aria-hidden />
                    </div>
                    <div className="card-content">
                        <div className="card-value">{loading ? '…' : stats.totalProfesores}</div>
                        <div className="card-title">Total Profesores</div>
                    </div>
                </div>
                <div className="card card-secondary">
                    <div className="card-icon">
                        <i className="fas fa-arrow-rotate-left" aria-hidden />
                    </div>
                    <div className="card-content">
                        <div className="card-value">{loading ? '…' : stats.totalDevoluciones}</div>
                        <div className="card-title">Total Devoluciones</div>
                    </div>
                </div>
            </div>

            <div className="admin-content-section">
                <h3 className="admin-section-title">
                    <i className="fas fa-list"></i>
                    Últimos Préstamos
                </h3>
                <div className="table-container">
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
                                    <td colSpan={5}>
                                        <div className="admin-loading-spinner"></div>
                                    </td>
                                </tr>
                            ) : prestamos.length === 0 ? (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="admin-empty-state">
                                            <i className="fas fa-inbox"></i>
                                            <h3>No hay préstamos recientes</h3>
                                            <p>Los nuevos préstamos aparecerán aquí.</p>
                                        </div>
                                    </td>
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
            </div>
        </div>
    );
};

export default Dashboard;
