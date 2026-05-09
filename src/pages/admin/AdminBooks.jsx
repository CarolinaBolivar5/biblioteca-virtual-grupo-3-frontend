import React, { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { actualizarLibro, crearLibro, eliminarLibro, getCategorias, getLibros } from '../../services/api';

const emptyBookForm = {
    nombreLibro: '',
    autoresTexto: '',
    cantidadPaginas: '',
    descripcion: '',
    googleId: '',
    thumbnail: '',
    categoriaId: '',
};

const AdminBooks = () => {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [createFormData, setCreateFormData] = useState(emptyBookForm);
    const [editFormData, setEditFormData] = useState(emptyBookForm);
    const [submitting, setSubmitting] = useState(false);

    const fetchAdminData = async () => {
        setLoading(true);
        const [booksData, categoriesData] = await Promise.all([getLibros(), getCategorias()]);
        setBooks(booksData);
        setCategories(categoriesData);
        setCreateFormData((current) => ({ ...current, categoriaId: current.categoriaId || categoriesData[0]?.id || '' }));
        setLoading(false);
    };

    useEffect(() => {
        let cancelled = false;

        Promise.all([getLibros(), getCategorias()])
            .then(([booksData, categoriesData]) => {
                if (!cancelled) {
                    setBooks(booksData);
                    setCategories(categoriesData);
                    setCreateFormData((current) => ({ ...current, categoriaId: current.categoriaId || categoriesData[0]?.id || '' }));
                }
            })
            .catch(() => {
                if (!cancelled) {
                    void Swal.fire('Error', 'No se pudo cargar el catalogo', 'error');
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const filteredBooks = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return books;
        return books.filter((book) =>
            [book.id, book.titulo, book.descripcion, book.autoresTexto]
                .some((value) => String(value ?? '').toLowerCase().includes(query))
        );
    }, [books, search]);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Eliminar libro',
            text: 'Esta accion no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            try {
                await eliminarLibro(id);
                await Swal.fire('Eliminado', 'El libro ha sido eliminado.', 'success');
                await fetchAdminData();
            } catch {
                await Swal.fire('Error', 'No se pudo eliminar el libro', 'error');
            }
        }
    };

    const handleCreateChange = (event) => {
        setCreateFormData({ ...createFormData, [event.target.name]: event.target.value });
    };

    const handleCreateSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        try {
            await crearLibro(createFormData);
            await Swal.fire('Guardado', 'Libro registrado correctamente.', 'success');
            setCreateFormData({ ...emptyBookForm, categoriaId: categories[0]?.id || '' });
            setShowCreateForm(false);
            await fetchAdminData();
        } catch {
            await Swal.fire('Error', 'No se pudo guardar el libro', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (book) => {
        setEditingBook(book);
        setEditFormData({
            nombreLibro: book.titulo,
            autoresTexto: book.autoresTexto || '',
            cantidadPaginas: book.cantidadPaginas || '',
            descripcion: book.descripcion,
            googleId: book.googleId || '',
            thumbnail: book.thumbnail || '',
            categoriaId: book.categoria?.id || categories[0]?.id || '',
        });
        setShowEditModal(true);
    };

    const handleEditChange = (event) => {
        setEditFormData({ ...editFormData, [event.target.name]: event.target.value });
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        try {
            await actualizarLibro(editingBook.id, editFormData);
            await Swal.fire('Actualizado', 'El libro ha sido actualizado.', 'success');
            setShowEditModal(false);
            await fetchAdminData();
        } catch {
            await Swal.fire('Error', 'No se pudo actualizar el libro', 'error');
        }
    };

    const renderCategorySelect = (value, onChange) => (
        <select name="categoriaId" value={value} onChange={onChange} required disabled={categories.length === 0}>
            {categories.length === 0 ? (
                <option value="">No hay categorias</option>
            ) : (
                categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.nombre}</option>
                ))
            )}
        </select>
    );

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
                    <label>Categoria <span className="text-danger">*</span></label>
                    {renderCategorySelect(formData.categoriaId, onChange)}
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
                        {renderBookForm(createFormData, handleCreateChange, submitting ? 'Guardando...' : 'Registrar Libro', submitting || !createFormData.categoriaId)}
                    </form>
                </div>
            )}

            <div className="table-container">
                <div className="table-actions">
                    <div className="search-input">
                        <i className="fas fa-search search-icon"></i>
                        <input type="search" placeholder="Buscar titulo..." value={search} onChange={(event) => setSearch(event.target.value)} />
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
                        ) : filteredBooks.length === 0 ? (
                            <tr><td colSpan="5">No hay libros registrados.</td></tr>
                        ) : (
                            filteredBooks.map((book) => (
                                <tr key={book.id}>
                                    <td>{book.id}</td>
                                    <td>{book.titulo?.substring(0, 30)}</td>
                                    <td>{book.descripcion?.substring(0, 40)}...</td>
                                    <td>
                                        <span className={`badge ${book.disponible ? 'bg-success' : 'bg-warning'}`}>
                                            {book.disponible ? 'Disponible' : 'Ocupado'}
                                        </span>
                                    </td>
                                    <td className="actions">
                                        <button className="btn btn-sm btn-info icon-btn" onClick={() => handleEdit(book)}><i className="fas fa-edit"></i></button>
                                        <button className="btn btn-sm btn-danger icon-btn" onClick={() => handleDelete(book.id)}><i className="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showEditModal && (
                <div className="modal-backdrop" onClick={() => setShowEditModal(false)}>
                    <div className="add-edit-form-container" onClick={(event) => event.stopPropagation()}>
                        <h4>Editar Libro</h4>
                        <form className="add-edit-form" onSubmit={handleEditSubmit}>
                            {renderBookForm(editFormData, handleEditChange, 'Actualizar Libro', !editFormData.categoriaId)}
                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminBooks;
