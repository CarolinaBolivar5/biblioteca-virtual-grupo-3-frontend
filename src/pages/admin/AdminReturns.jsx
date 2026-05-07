import React, { useMemo, useState } from 'react';
import Swal from 'sweetalert2';

const initialReturns = [
    {
        id: 9012,
        libro: 'El Principito',
        usuario: 'Carlos Ramirez',
        fechaDevolucion: '2026-04-12',
        estadoMultas: 'Sin multas',
    },
];

const AdminReturns = () => {
    const [returns, setReturns] = useState(initialReturns);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ prestamoId: '', observaciones: '' });

    const filteredReturns = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return returns;
        return returns.filter((item) =>
            [item.id, item.libro, item.usuario, item.fechaDevolucion, item.estadoMultas]
                .some((value) => String(value ?? '').toLowerCase().includes(query))
        );
    }, [returns, search]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setReturns((current) => [
            {
                id: form.prestamoId || Date.now(),
                libro: 'Pendiente de sincronizar',
                usuario: 'Pendiente de sincronizar',
                fechaDevolucion: new Date().toISOString().slice(0, 10),
                estadoMultas: form.observaciones ? 'Con observaciones' : 'Sin multas',
            },
            ...current,
        ]);
        setForm({ prestamoId: '', observaciones: '' });
        setShowForm(false);
        await Swal.fire('Procesado', 'El libro ha sido marcado como devuelto', 'success');
    };

    return (
        <>
            <div className="header-content">
                <div>
                    <h1>Devoluciones</h1>
                    <p className="breadcrumb">Home / Principal / Devoluciones</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={() => setShowForm((value) => !value)}>
                    <i className="fas fa-undo icon-btn"></i>{showForm ? 'Ocultar formulario' : 'Procesar Devolucion'}
                </button>
            </div>

            {showForm && (
                <div className="add-edit-form-container">
                    <form className="add-edit-form" onSubmit={handleSubmit}>
                        <div className="form-group-row">
                            <div className="form-group">
                                <label>ID del Prestamo o Libro</label>
                                <input
                                    type="text"
                                    value={form.prestamoId}
                                    onChange={(event) => setForm((current) => ({ ...current, prestamoId: event.target.value }))}
                                    placeholder="Escanea o escribe codigo..."
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Observaciones</label>
                                <input
                                    type="text"
                                    value={form.observaciones}
                                    onChange={(event) => setForm((current) => ({ ...current, observaciones: event.target.value }))}
                                    placeholder="Danos, retrasos u observaciones"
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
                            placeholder="Buscar libro devuelto..."
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
                            <th>Estado Multas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReturns.map((item) => (
                            <tr key={item.id}>
                                <td>#{item.id}</td>
                                <td>{item.libro}</td>
                                <td>{item.usuario}</td>
                                <td>{item.fechaDevolucion}</td>
                                <td><span className="badge bg-success">{item.estadoMultas}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default AdminReturns;
