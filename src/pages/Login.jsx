import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getUsuarios, getPerfilPorId } from '../services/api';
import { saveAuthData } from '../helpers/auth';

const getFullName = (source) => {
  if (!source || typeof source !== 'object') return '';

  const firstName = source.nombre ?? source.firstName ?? source.perfil?.nombre ?? source.perfil?.firstName ?? '';
  const lastName = source.apellido ?? source.lastName ?? source.perfil?.apellido ?? source.perfil?.lastName ?? '';

  return `${String(firstName).trim()} ${String(lastName).trim()}`.trim();
};

const normalizeUsers = (data) => {
  const list = Array.isArray(data) ? data : data?.usuarios ?? data?.content ?? data?.data ?? [];
  return Array.isArray(list) ? list : [];
};

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await getUsuarios();

      const usuarios = normalizeUsers(data);
      const email = credentials.email.trim();
      const authUser = usuarios.find(
        (user) =>
          (user.email ?? '').trim().toLowerCase() === email.toLowerCase() &&
          user.password === credentials.password
      );

      if (!authUser) {
        throw new Error('Correo o contrasena incorrectos.');
      }

      const perfilId = authUser.perfilId ?? authUser.perfil?.id;
      let perfil = authUser.perfil ?? null;

      if (!perfil && perfilId) {
        perfil = await getPerfilPorId(perfilId);
      }

      const rol = authUser.rol?.descripcion || authUser.rolDescripcion || authUser.rol || '';
      const nombre = getFullName({ ...perfil, ...authUser }) || email;

      saveAuthData(authUser.token || 'backend-session', {
        ...authUser,
        perfil,
        perfilId,
        nombre,
        email,
        rol,
        rolDescripcion: rol,
        tipoUsuario: rol || 'Usuario',
      });

      Swal.fire({
        icon: 'success',
        title: 'Bienvenido',
        text: 'Has iniciado sesion correctamente.',
        timer: 1500,
        showConfirmButton: false,
      });

      navigate(rol.toString().toUpperCase().includes('ADMIN') ? '/admin/perfil' : '/');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error de acceso',
        text: error.message || 'Usuario o contrasena incorrectos',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Iniciar Sesion</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="mb-3">
            <label className="form-label">Correo electronico</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contrasena</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Accediendo...' : 'Ingresar'}
          </button>
        </form>
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <span>No tienes cuenta? <Link to="/register">Registrate aqui</Link></span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f6f8',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
};

export default Login;
