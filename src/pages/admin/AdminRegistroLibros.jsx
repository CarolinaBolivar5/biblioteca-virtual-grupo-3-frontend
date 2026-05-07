import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { crearLibro } from '../../services/api';

const AdminRegistroLibros = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ 
        nombreLibro: '', 
        autoresTexto: '', 
        cantidadPaginas: '', 
        descripcion: '', 
        googleId: '', 
        thumbnail: '', 
        categoriaId: 1 // Asumir categoría por defecto
    });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = e => setFormData({...formData, [e.target.name]: e.target.value});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await crearLibro(formData);
            Swal.fire('¡Éxito!', 'Libro registrado', 'success').then(() => navigate('/admin/catalogo'));
        } catch {
            Swal.fire('Error', 'Fallo al guardar', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div className="header-content">
                <div>
                    <h1>Añadir Libro</h1>
                    <p className="breadcrumb">Home / Libros / Catálogo / Insertar</p>
                </div>
                <Link to="/admin/catalogo" className="btn btn-secondary">
                    <i className="fas fa-arrow-left icon-btn"></i>Volver
                </Link>
            </div>

            <div className="add-edit-form-container">
                <form className="add-edit-form" onSubmit={handleSubmit}>
                    <div className="form-group-row">
                        <div className="form-group">
                            <label>Nombre del Libro <span className="text-danger">*</span></label>
                            <input type="text" name="nombreLibro" value={formData.nombreLibro} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Autores <span className="text-danger">*</span></label>
                            <input type="text" name="autoresTexto" value={formData.autoresTexto} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="form-group-row">
                        <div className="form-group">
                            <label>Cantidad de Páginas</label>
                            <input type="number" name="cantidadPaginas" value={formData.cantidadPaginas} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Categoría ID <span className="text-danger">*</span></label>
                            <input type="number" name="categoriaId" value={formData.categoriaId} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="form-group-row">
                        <div className="form-group">
                            <label>Google ID</label>
                            <input type="text" name="googleId" value={formData.googleId} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Thumbnail URL</label>
                            <input type="url" name="thumbnail" value={formData.thumbnail} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-group-row">
                        <div className="form-group">
                            <label>Descripción / Reseña <span className="text-danger">*</span></label>
                            <textarea rows="3" name="descripcion" value={formData.descripcion} onChange={handleChange} required></textarea>
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            <i className="fas fa-save icon-btn"></i>Registrar Libro a BD
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AdminRegistroLibros;
