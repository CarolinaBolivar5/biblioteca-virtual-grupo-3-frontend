import React, { useMemo, useState } from 'react';
import Swal from 'sweetalert2';

const initialCategories = [
    { id: 1, nombre: 'Ficcion', descripcion: 'Libros que contienen historias irreales' },
    { id: 2, nombre: 'Ciencia', descripcion: 'Divulgacion y material cientifico' },
];

const AdminCategories = () => {
    const [categories, setCategories] = useState(initialCategories);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ nombre: '', descripcion: '' });

    const filteredCategories = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return categories;
        return categories.filter((category) =>
            [category.id, category.nombre, category.descripcion]
                .some((value) => String(value ?? '').toLowerCase().includes(query))
        );
    }, [categories, search]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!form.nombre.trim()) {
            await Swal.fire('Error', 'El nombre es obligatorio', 'error');
            return;
        }

        setCategories((current) => [
            ...current,
            {
                id: Date.now(),
                nombre: form.nombre.trim(),
                descripcion: form.descripcion.trim() || 'Sin descripcion',
            },
        ]);
        setForm({ nombre: '', descripcion: '' });
        setShowForm(false);
        await Swal.fire('Guardado', 'Categoria agregada exitosamente', 'success');
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Eliminar categoria',
            text: 'Esta accion no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
        });
        if (result.isConfirmed) {
            setCategories((current) => current.filter((category) => category.id !== id));
        }
    };

    return (
        <>
            <div className="header-content">
                <div>
                    <h1>Categorias</h1>
                    <p className="breadcrumb">Home / Libros / Categorias</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={() => setShowForm((value) => !value)}>
                    <i className="fas fa-plus icon-btn"></i>{showForm ? 'Ocultar formulario' : 'Nueva Categoria'}
                </button>
            </div>

            {showForm && (
                <div className="add-edit-form-container">
                    <h4>Detalles de la categoria</h4>
                    <form className="add-edit-form" onSubmit={handleSubmit}>
                        <div className="form-group-row">
                            <div className="form-group">
                                <label>Nombre de Categoria <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    value={form.nombre}
                                    onChange={(event) => setForm((current) => ({ ...current, nombre: event.target.value }))}
                                    placeholder="Ej. Aventura"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group-row">
                            <div className="form-group">
                                <label>Descripcion</label>
                                <textarea
                                    rows="4"
                                    value={form.descripcion}
                                    onChange={(event) => setForm((current) => ({ ...current, descripcion: event.target.value }))}
                                    placeholder="Agrega una breve descripcion"
                                ></textarea>
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                                <i className="fas fa-save icon-btn"></i>Guardar Categoria
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
                            placeholder="Buscar categoria..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </div>
                </div>

                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID Categoria</th>
                            <th>Nombre</th>
                            <th>Descripcion</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.nombre}</td>
                                <td>{category.descripcion}</td>
                                <td className="actions">
                                    <button className="btn btn-sm btn-danger icon-btn" title="Eliminar" onClick={() => handleDelete(category.id)}>
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default AdminCategories;
