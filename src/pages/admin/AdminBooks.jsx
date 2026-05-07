import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { actualizarLibro, crearLibro, eliminarLibro, getLibros } from '../../services/api';

const emptyBookForm = () => ({
    nombreLibro: '',
    autoresTexto: '',
    cantidadPaginas: '',
    descripcion: '',
    googleId: '',
    thumbnail: '',
    categoriaId: 1,
});

const AdminBooks = () => {
    const [libros, setLibros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingLibro, setEditingLibro] = useState(null);
    const [createFormData, setCreateFormData] = useState(emptyBookForm);
    const [editFormData, setEditFormData] = useState(emptyBookForm);
    const [submitting, setSubmitting] = useState(false);

    const fetchLibros = async () => {
        const data = await getLibros();
        setLibros(data);
        setLoading(false);
    };

    useEffect(() => {
        let cancelled = false;

        const loadLibros = async () => {
            const data = await getLibros();
            if (!cancelled) {
                setLibros(data);
                setLoading(false);
            }
        };

        void loadLibros();
        return () => {
            cancelled = true;
        };
    }, []);

    const handleCreateChange = (event) => {
        setCreateFormData({ ...createFormData, [event.target.name]: event.target.value });
    };

    const handleCreateSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        try {
            await crearLibro(createFormData);
            await Swal.fire('Guardado', 'Libro registrado correctamente.', 'success');
            setCreateFormData(emptyBookForm());
            setShowCreateForm(false);
            await fetchLibros();
        } catch {
            Swal.fire('Error', 'No se pudo guardar el libro.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Eliminar libro',
            text: 'Esta accion no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
        });
        if (result.isConfirmed) {
            try {
                await eliminarLibro(id);
                await Swal.fire('Eliminado', 'El libro ha sido eliminado.', 'success');
                await fetchLibros();
            } catch {
                Swal.fire('Error', 'No se pudo eliminar el libro', 'error');
            }
        }
    };

    const handleEdit = (libro) => {
        setEditingLibro(libro);
        setEditFormData({
            nombreLibro: libro.titulo,
            autoresTexto: libro.autoresTexto || '',
            cantidadPaginas: libro.cantidadPaginas || '',
            descripcion: libro.descripcion,
            googleId: libro.googleId || '',
            thumbnail: libro.thumbnail || '',
            categoriaId: libro.categoria?.id || 1,
        });
        setShowEditModal(true);
    };

    const handleEditChange = (event) => {
        setEditFormData({ ...editFormData, [event.target.name]: event.target.value });
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        try {
            await actualizarLibro(editingLibro.id, editFormData);
            await Swal.fire('Actualizado', 'El libro ha sido actualizado.', 'success');
            setShowEditModal(false);
            await fetchLibros();
        } catch {
            Swal.fire('Error', 'No se pudo actualizar el libro', 'error');
        }
    };

    const renderBookForm = (formData, onChange, submitLabel, disabled = false) => (
        <>
            <div className="form-group-row">
                <div className="form-group">
                    <label>Nombre del Libro <span className="text-danger">*</span></label>
                    <input type="text" name="nombreLibro" value={formData.nombreLibro} onChange={onChange} required />
                </div>
                <div className="form-group">
                    <label>Autores <span className="text-danger">*</span></label>
                    <input type="text" name="autoresTexto" value={formData.autoresTexto} onChange={onChange} required />
                </div>
            </div>
            <div className="form-group-row">
                <div className="form-group">
                    <label>Cantidad de Paginas</label>
                    <input type="number" name="cantidadPaginas" value={formData.cantidadPaginas} onChange={onChange} />
                </div>
                <div className="form-group">
                    <label>Categoria ID <span className="text-danger">*</span></label>
                    <input type="number" name="categoriaId" value={formData.categoriaId} onChange={onChange} required />
                </div>
            </div>
            <div className="form-group-row">
                <div className="form-group">
                    <label>Google ID</label>
                    <input type="text" name="googleId" value={formData.googleId} onChange={onChange} />
                </div>
                <div className="form-group">
                    <label>Thumbnail URL</label>
                    <input type="url" name="thumbnail" value={formData.thumbnail} onChange={onChange} />
                </div>
            </div>
            <div className="form-group-row">
                <div className="form-group">
                    <label>Descripcion / Resena <span className="text-danger">*</span></label>
                    <textarea rows="3" name="descripcion" value={formData.descripcion} onChange={onChange} required></textarea>
                </div>
            </div>
            <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={disabled}>
                    <i className="fas fa-save icon-btn"></i>{submitLabel}
                </button>
            </div>
        </>
    );

    return (
        <>
            <div className="header-content">
                <div>
                    <h1>Catalogo Interno (Admin)</h1>
                    <p className="breadcrumb">Home / Libros / Catalogo BD</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={() => setShowCreateForm((value) => !value)}>
                    <i className="fas fa-plus icon-btn"></i>{showCreateForm ? 'Ocultar formulario' : 'Anadir Libro'}
                </button>
            </div>

            {showCreateForm && (
                <div className="add-edit-form-container">
                    <h4>Datos del libro</h4>
                    <form className="add-edit-form" onSubmit={handleCreateSubmit}>
                        {renderBookForm(createFormData, handleCreateChange, submitting ? 'Guardando...' : 'Registrar Libro', submitting)}
                    </form>
                </div>
            )}

            <div className="table-container">
                <div className="table-actions">
                    <div className="search-input">
                        <i className="fas fa-search search-icon"></i>
                        <input type="text" placeholder="Buscar titulo..." />
                    </div>
                </div>

                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Titulo</th>
                            <th>Descripcion</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5">Cargando catalogo...</td></tr>
                        ) : (
                            libros.map((libro) => (
                                <tr key={libro.id}>
                                    <td>{libro.id}</td>
                                    <td>{libro.titulo.substring(0, 20)}</td>
                                    <td>{libro.descripcion.substring(0, 30)}...</td>
                                    <td>
                                        <span className={`badge ${libro.disponible ? 'bg-success' : 'bg-warning'}`}>
                                            {libro.disponible ? 'Disponible' : 'Ocupado'}
                                        </span>
                                    </td>
                                    <td className="actions">
                                        <button className="btn btn-sm btn-info icon-btn" onClick={() => handleEdit(libro)}><i className="fas fa-edit"></i></button>
                                        <button className="btn btn-sm btn-danger icon-btn" onClick={() => handleDelete(libro.id)}><i className="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showEditModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}
                    onClick={() => setShowEditModal(false)}
                >
                    <div
                        style={{
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '8px',
                            width: '90%',
                            maxWidth: '600px',
                            maxHeight: '80vh',
                            overflowY: 'auto',
                        }}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h5>Editar Libro</h5>
                            <button style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }} onClick={() => setShowEditModal(false)}>&times;</button>
                        </div>
                        <form className="add-edit-form" onSubmit={handleEditSubmit}>
                            {renderBookForm(editFormData, handleEditChange, 'Actualizar Libro')}
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminBooks;
