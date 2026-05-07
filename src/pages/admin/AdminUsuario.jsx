import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsuarios } from '../../services/api';

const AdminUsuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuarios = async () => {
      const data = await getUsuarios();
      setUsuarios(data);
      setLoading(false);
    };
    fetchUsuarios();
  }, []);

  return (
    <>
      <div className="header-content">
        <div>
          <h1>Usuarios</h1>
          <p className="breadcrumb">Home / Usuarios</p>
        </div>
        <Link to="/admin/registro-usuario" className="btn btn-primary">
          <i className="fas fa-user-plus icon-btn"></i>Nuevo Usuario
        </Link>
      </div>

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

export default AdminUsuario;
