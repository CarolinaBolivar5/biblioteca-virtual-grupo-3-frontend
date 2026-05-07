import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { crearUsuario } from '../../services/api';

const AdminRegistroUsuario = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        nombres: '',
        apellidos: '',
        email: '',
        password: '',
        numeroDocumento: '',
        tipoDocumento: 'CC',
        telefono: '',
        direccion: '',
        rolId: 7,
    });

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await crearUsuario(form);
            Swal.fire({
                title: 'Usuario registrado',
                text: `${form.nombres} ${form.apellidos}`.trim() || 'El usuario se guardó correctamente.',
                icon: 'success',
}).then(() => navigate('/admin/usuarios'));
        } catch {
            Swal.fire('Error', 'No se pudo crear el usuario en el backend', 'error');
        }
    };

    return (
        <>
            <div className="header-content">
                <div>
                    <h1>Registro de Usuario</h1>
                    <p className="breadcrumb">Home / Usuarios / Nuevo usuario</p>
                </div>
                <Link to="/admin/usuarios" className="btn btn-secondary">
                    <i className="fas fa-arrow-left icon-btn"></i>Volver
                </Link>
            </div>

            <div className="add-edit-form-container">
                <h4>Datos del usuario</h4>
                <form className="add-edit-form" onSubmit={handleSubmit}>
                    <div className="form-group-row">
                        <div className="form-group">
                            <label>Nombre(s) <span className="text-danger">*</span></label>
                            <input
                                name="nombres"
                                type="text"
                                required
                                placeholder="Nombre del usuario"
                                value={form.nombres}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Apellidos <span className="text-danger">*</span></label>
                            <input
                                name="apellidos"
                                type="text"
                                required
                                placeholder="Apellidos"
                                value={form.apellidos}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="form-group-row">
                        <div className="form-group">
                            <label>Correo electrónico <span className="text-danger">*</span></label>
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="usuario@correo.com"
                                value={form.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Contraseña <span className="text-danger">*</span></label>
                            <input
                                name="password"
                                type="password"
                                required
                                placeholder="Contraseña segura"
                                value={form.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="form-group-row">
                        <div className="form-group">
                            <label>Documento <span className="text-danger">*</span></label>
                            <input
                                name="numeroDocumento"
                                type="text"
                                required
                                placeholder="Número de documento"
                                value={form.numeroDocumento}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Tipo de documento</label>
                            <select name="tipoDocumento" value={form.tipoDocumento} onChange={handleChange}>
                                <option value="CC">CC</option>
                                <option value="TI">TI</option>
                                <option value="CE">CE</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group-row">
                        <div className="form-group">
                            <label>Teléfono</label>
                            <input
                                name="telefono"
                                type="text"
                                placeholder="Teléfono"
                                value={form.telefono}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Dirección</label>
                            <input
                                name="direccion"
                                type="text"
                                placeholder="Dirección"
                                value={form.direccion}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="form-group-row">
                        <div className="form-group">
                            <label>Rol en la plataforma</label>
                            <select name="rolId" value={form.rolId} onChange={handleChange}>
                                <option value={7}>Usuario</option>
                                <option value={6}>Administrador</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">
                            <i className="fas fa-save icon-btn"></i>Guardar usuario
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AdminRegistroUsuario;
