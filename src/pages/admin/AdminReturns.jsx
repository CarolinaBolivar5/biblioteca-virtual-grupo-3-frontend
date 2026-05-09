import React, { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { getPrestamos } from '../../services/api';

const normalizeReturnRow = (loan) => ({
    id: loan.id,
    libro: loan.libro?.nombreLibro ?? loan.libro?.titulo ?? 'Sin libro',
    usuario: [loan.perfil?.nombre, loan.perfil?.apellido].filter(Boolean).join(' ') || 'Sin usuario',
    fechaDevolucion: loan.fechaDevolucion ?? 'Sin fecha',
    estado: loan.estado ?? 'Sin estado',
});

const AdminReturns = () => {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ prestamoId: '', observaciones: '' });

    const fetchReturns = async () => {
        setLoading(true);
        try {
            const data = await getPrestamos();
            setReturns(data.map(normalizeReturnRow));
        } catch {
            await Swal.fire('Error', 'No se pudieron cargar los prestamos', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchReturns();
    }, []);

    const filteredReturns = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return returns;
        return returns.filter((item) =>
            [item.id, item.libro, item.usuario, item.fechaDevolucion, item.estado]
                .some((value) => String(value ?? '').toLowerCase().includes(query))
        );
    }, [returns, search]);

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        await Swal.fire(
            'Endpoint pendiente',
            'El backend aun no tiene un endpoint de devoluciones; por ahora se muestra el prestamo y no se modifica el servidor.',
            'info'
        );
        setFormData({ prestamoId: '', observaciones: '' });
        setShowForm(false);
    };

    return (
        <>
            <div className="header-content">
                <div>
                    <h1>Devoluciones</h1>
                    <p className="breadcrumb">Home / Principal / Devoluciones</p>
                </div>
                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={fetchReturns} disabled={loading}>
                        <i className="fas fa-sync-alt icon-btn"></i>{loading ? 'Actualizando...' : 'Actualizar'}
                    </button>
                    <button type="button" className="btn btn-primary" onClick={() => setShowForm((value) => !value)}>
                        <i className="fas fa-undo icon-btn"></i>Registrar Devolucion
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="add-edit-form-container">
                    <form className="add-edit-form" onSubmit={handleSubmit}>
                        <div className="form-group-row">
                            <div className="form-group">
                                <label>ID del Prestamo o Libro</label>
                                <input
                                    type="text"
                                    name="prestamoId"
                                    value={formData.prestamoId}
                                    onChange={handleChange}
                                    placeholder="Escanea o escribe codigo..."
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Observaciones</label>
                                <input
                                    type="text"
                                    name="observaciones"
                                    value={formData.observaciones}
                                    onChange={handleChange}
                                    placeholder="Opcional..."
                                />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-warning">
                                <i className="fas fa-check icon-btn"></i>Confirmar Devolucion
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="table-container">
                <div className="table-actions">
                    <div className="search-input">
                        <i className="fas fa-search search-icon"></i>
                        <input
                            type="search"
                            placeholder="Buscar prestamo..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </div>
                </div>

                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Prestamo ID</th>
                            <th>Libro</th>
                            <th>Usuario</th>
                            <th>Fecha Devolucion</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5">Cargando devoluciones...</td></tr>
                        ) : filteredReturns.length === 0 ? (
                            <tr><td colSpan="5">No hay prestamos para mostrar.</td></tr>
                        ) : (
                            filteredReturns.map((item) => (
                                <tr key={item.id}>
                                    <td>#{item.id}</td>
                                    <td>{item.libro}</td>
                                    <td>{item.usuario}</td>
                                    <td>{item.fechaDevolucion}</td>
                                    <td><span className="badge bg-success">{item.estado}</span></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default AdminReturns;
