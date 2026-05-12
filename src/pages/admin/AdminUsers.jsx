import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { crearUsuario, getUsuarios } from '../../services/api';
import '../../styles/admin/buttons.css';

const emptyUserForm = {
  nombres: '',
  apellidos: '',
  email: '',
  password: '',
  numeroDocumento: '',
  tipoDocumento: 'CC',
  telefono: '',
  direccion: '',
  rolId: 7,
};

const AdminUsers = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyUserForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchUsuarios = async () => {
    const data = await getUsuarios();
    setUsuarios(data);
    setLoading(false);
  };

  useEffect(() => {
    void fetchUsuarios();
  }, []);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await crearUsuario(form);
      await Swal.fire('Usuario registrado', `${form.nombres} ${form.apellidos}`.trim() || 'El usuario se guardo correctamente.', 'success');
      setForm(emptyUserForm);
      setShowForm(false);
      await fetchUsuarios();
    } catch {
      await Swal.fire('Error', 'No se pudo crear el usuario en el backend', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="header-content">
        <div>
          <h1>Usuarios</h1>
          <p className="breadcrumb">Home / Usuarios</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setShowForm((value) => !value)}>
          <i className="fas fa-user-plus icon-btn"></i>{showForm ? 'Ocultar formulario' : 'Nuevo Usuario'}
        </button>
      </div>

      {showForm && (
        <div className="add-edit-form-container">
          <h4>Datos del usuario</h4>
          <form className="add-edit-form" onSubmit={handleSubmit}>
            <div className="form-group-row">
              <div className="form-group">
                <label>Nombre(s) <span className="text-danger">*</span></label>
                <input name="nombres" type="text" required value={form.nombres} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Apellidos <span className="text-danger">*</span></label>
                <input name="apellidos" type="text" required value={form.apellidos} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group-row">
              <div className="form-group">
                <label>Correo electronico <span className="text-danger">*</span></label>
                <input name="email" type="email" required value={form.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Contrasena <span className="text-danger">*</span></label>
                <input name="password" type="password" required value={form.password} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group-row">
              <div className="form-group">
                <label>Documento <span className="text-danger">*</span></label>
                <input name="numeroDocumento" type="text" required value={form.numeroDocumento} onChange={handleChange} />
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
                <label>Telefono</label>
                <input name="telefono" type="text" value={form.telefono} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Direccion</label>
                <input name="direccion" type="text" value={form.direccion} onChange={handleChange} />
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
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                <i className="fas fa-save icon-btn"></i>{submitting ? 'Guardando...' : 'Guardar usuario'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <div className="table-actions">
          <div className="search-input">
            <i className="fas fa-search search-icon"></i>
            <input type="search" placeholder="Buscar por nombre o correo..." />
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">Cargando usuarios...</td>
              </tr>
            ) : usuarios.length === 0 ? (
              <tr>
                <td colSpan="6">No hay usuarios registrados.</td>
              </tr>
            ) : (
              usuarios.map((user) => {
                const nombre = user.perfil ? `${user.perfil.nombre} ${user.perfil.apellido}` : 'Sin nombre';
                const rol = user.rol ? user.rol.descripcion : 'Sin rol';
                const estado = user.email ? 'Activo' : 'Inactivo';
                return (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{nombre}</td>
                    <td>{user.email}</td>
                    <td>{rol}</td>
                    <td><span className={`badge ${estado === 'Activo' ? 'bg-success' : 'bg-secondary'}`}>{estado}</span></td>
                    <td className="actions">
                      <button type="button" className="btn btn-sm btn-info icon-btn" title="Editar usuario">
                        <i className="fas fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminUsers;
