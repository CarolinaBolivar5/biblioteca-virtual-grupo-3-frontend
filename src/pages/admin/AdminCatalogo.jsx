import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getLibros, eliminarLibro, actualizarLibro } from '../../services/api';

const AdminCatalogo = () => {
    const [libros, setLibros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingLibro, setEditingLibro] = useState(null);
    const [editFormData, setEditFormData] = useState({
        nombreLibro: '',
        autoresTexto: '',
        cantidadPaginas: '',
        descripcion: '',
        googleId: '',
        thumbnail: '',
        categoriaId: 1
    });

    useEffect(() => {
        fetchLibros();
    }, []);

    const fetchLibros = async () => {
        const data = await getLibros();
        setLibros(data);
        setLoading(false);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar'
        });
        if (result.isConfirmed) {
            try {
                await eliminarLibro(id);
                Swal.fire('Eliminado!', 'El libro ha sido eliminado.', 'success');
                fetchLibros(); // Recargar lista
            } catch (error) {
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
            categoriaId: libro.categoria?.id || 1
        });
        setShowEditModal(true);
    };

    const handleEditChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await actualizarLibro(editingLibro.id, editFormData);
            Swal.fire('Actualizado!', 'El libro ha sido actualizado.', 'success');
            setShowEditModal(false);
            fetchLibros(); // Recargar lista
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar el libro', 'error');
        }
    };

    return (
        <>
            <div className="header-content">
                <div>
                    <h1>Catálogo Interno (Admin)</h1>
                    <p className="breadcrumb">Home / Libros / Catálogo BD</p>
                </div>
                <Link to="/admin/registro-libros" className="btn btn-primary">
                    <i className="fas fa-plus icon-btn"></i>Añadir Libro
                </Link>
            </div>

            <div className="table-container">
                <div className="table-actions">
                    <div className="search-input">
                        <i className="fas fa-search search-icon"></i>
                        <input type="text" placeholder="Buscar tíulo..." />
                    </div>
                </div>

                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Descripción</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5">Cargando catálogo...</td></tr>
                        ) : (
                            libros.map(libro => (
                                <tr key={libro.id}>
                                    <td>{libro.id}</td>
                                    <td>{libro.titulo.substring(0, 20)}</td>
                                    <td>{libro.descripcion.substring(0, 30)}...</td>
                                    <td><span className={`badge ${libro.disponible ? 'bg-success' : 'bg-warning'}`}>
                                        {libro.disponible ? 'Disponible' : 'Ocupado'}    
                                    </span></td>
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
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }} onClick={() => setShowEditModal(false)}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        width: '90%',
                        maxWidth: '600px',
                        maxHeight: '80vh',
                        overflowY: 'auto'
                    }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h5>Editar Libro</h5>
                            <button style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }} onClick={() => setShowEditModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleEditSubmit}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
                                <div style={{ flex: '1 1 45%', minWidth: '200px' }}>
                                    <label>Nombre del Libro <span style={{ color: 'red' }}>*</span></label>
                                    <input type="text" name="nombreLibro" value={editFormData.nombreLibro} onChange={handleEditChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                                </div>
                                <div style={{ flex: '1 1 45%', minWidth: '200px' }}>
                                    <label>Autores <span style={{ color: 'red' }}>*</span></label>
                                    <input type="text" name="autoresTexto" value={editFormData.autoresTexto} onChange={handleEditChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
                                <div style={{ flex: '1 1 45%', minWidth: '200px' }}>
                                    <label>Cantidad de Páginas</label>
                                    <input type="number" name="cantidadPaginas" value={editFormData.cantidadPaginas} onChange={handleEditChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                                </div>
                                <div style={{ flex: '1 1 45%', minWidth: '200px' }}>
                                    <label>Categoría ID <span style={{ color: 'red' }}>*</span></label>
                                    <input type="number" name="categoriaId" value={editFormData.categoriaId} onChange={handleEditChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
                                <div style={{ flex: '1 1 45%', minWidth: '200px' }}>
                                    <label>Google ID</label>
                                    <input type="text" name="googleId" value={editFormData.googleId} onChange={handleEditChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                                </div>
                                <div style={{ flex: '1 1 45%', minWidth: '200px' }}>
                                    <label>Thumbnail URL</label>
                                    <input type="url" name="thumbnail" value={editFormData.thumbnail} onChange={handleEditChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                                </div>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label>Descripción / Reseña <span style={{ color: 'red' }}>*</span></label>
                                <textarea rows="3" name="descripcion" value={editFormData.descripcion} onChange={handleEditChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }}></textarea>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Actualizar Libro</button>
                                <button type="button" style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => setShowEditModal(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminCatalogo;
