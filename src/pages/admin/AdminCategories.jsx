import React, { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { crearCategoria, getCategorias } from '../../services/api';
import '../../styles/admin/buttons.css';
import '../../styles/admin/tables.css';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ nombre: '', descripcion: '' });
    const [submitting, setSubmitting] = useState(false);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await getCategorias();
            setCategories(data);
        } catch {
            await Swal.fire('Error', 'No se pudieron cargar las categorias', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchCategories();
    }, []);

    const filteredCategories = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return categories;
        return categories.filter((category) =>
            [category.id, category.nombre, category.descripcion]
                .some((value) => String(value ?? '').toLowerCase().includes(query))
        );
    }, [categories, search]);

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.nombre.trim()) {
            await Swal.fire('Error', 'El nombre es obligatorio', 'error');
            return;
        }

        setSubmitting(true);
        try {
            await crearCategoria({
                nombre: formData.nombre.trim(),
                descripcion: formData.descripcion.trim() || 'Sin descripcion',
            });
            setFormData({ nombre: '', descripcion: '' });
            setShowForm(false);
            await fetchCategories();
            await Swal.fire('Guardado', 'Categoria agregada exitosamente', 'success');
        } catch {
            await Swal.fire('Error', 'No se pudo guardar la categoria', 'error');
        } finally {
            setSubmitting(false);
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
                    <h4>Detalles de la Categoria</h4>
                    <form className="add-edit-form" onSubmit={handleSubmit}>
                        <div className="form-group-row">
                            <div className="form-group">
                                <label>Nombre de Categoria <span className="text-danger">*</span></label>
                                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej. Aventura" required />
                            </div>
                        </div>
                        <div className="form-group-row">
                            <div className="form-group">
                                <label>Descripcion</label>
                                <textarea rows="4" name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Agrega una breve descripcion"></textarea>
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary" disabled={submitting}>
                                <i className="fas fa-save icon-btn"></i>{submitting ? 'Guardando...' : 'Guardar Categoria'}
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
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="3">Cargando categorias...</td></tr>
                        ) : filteredCategories.length === 0 ? (
                            <tr><td colSpan="3">No hay categorias registradas.</td></tr>
                        ) : (
                            filteredCategories.map((category) => (
                                <tr key={category.id}>
                                    <td>{category.id}</td>
                                    <td>{category.nombre}</td>
                                    <td>{category.descripcion}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default AdminCategories;
