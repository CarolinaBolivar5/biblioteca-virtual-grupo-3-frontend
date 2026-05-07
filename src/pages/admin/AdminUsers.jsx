import React, { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import {
    createPerfil,
    createUsuario,
    getRoleIdByName,
    getRoles,
    getUsuarios,
} from '../../services/api';

const DEFAULT_USER_ROLE_ID = 7;

const emptyForm = () => ({
    nombre: '',
    apellido: '',
    tipoDocumento: 'CC',
    numeroDocumento: '',
    direccion: '',
    telefono: '',
    email: '',
    password: '',
});

const getFullName = (user) => {
    const perfil = user.perfil ?? {};
    const name = [perfil.nombre, perfil.apellido].filter(Boolean).join(' ').trim();
    return name || user.nombre || user.name || 'Usuario sin nombre';
};

const getRoleName = (user) => user.rol?.descripcion || user.rolDescripcion || user.rol || 'Sin rol';

const AdminUsers = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [search, setSearch] = useState('');
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const loadUsuarios = async () => {
        const data = await getUsuarios();
        setUsuarios(data);
    };

    useEffect(() => {
        let cancelled = false;

        const loadData = async () => {
            try {
                setLoading(true);
                const [usersData, rolesData] = await Promise.all([getUsuarios(), getRoles()]);
                if (!cancelled) {
                    setUsuarios(usersData);
                    setRoles(rolesData);
                }
            } catch (error) {
                if (!cancelled) {
                    Swal.fire('Error', error.message || 'No se pudieron cargar los usuarios.', 'error');
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        void loadData();
        return () => {
            cancelled = true;
        };
    }, []);

    const filteredUsuarios = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return usuarios;

        return usuarios.filter((user) => {
            const values = [
                user.id,
                getFullName(user),
                user.email,
                getRoleName(user),
                user.perfil?.numeroDocumento,
                user.perfil?.telefono,
            ];
            return values.some((value) => String(value ?? '').toLowerCase().includes(query));
        });
    }, [usuarios, search]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);

        try {
            const perfil = await createPerfil({
                tipoDocumento: form.tipoDocumento,
                numeroDocumento: form.numeroDocumento.trim(),
                nombre: form.nombre.trim(),
                apellido: form.apellido.trim(),
                direccion: form.direccion.trim(),
                telefono: form.telefono.trim(),
            });

            const perfilId = perfil?.id;
            if (typeof perfilId !== 'number') {
                throw new Error('La API no devolvio el ID del perfil creado.');
            }

            const rolId = getRoleIdByName(roles, 'USUARIO') ?? DEFAULT_USER_ROLE_ID;
            await createUsuario({
                email: form.email.trim(),
                password: form.password,
                rolId,
                perfilId,
            });

            await Swal.fire('Guardado', 'Usuario creado correctamente.', 'success');
            setForm(emptyForm());
            setShowForm(false);
            await loadUsuarios();
        } catch (error) {
            Swal.fire('Error', error.message || 'No se pudo crear el usuario.', 'error');
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
                    <i className="fas fa-user-plus icon-btn"></i>
                    {showForm ? 'Ocultar formulario' : 'Nuevo usuario'}
                </button>
            </div>

            {showForm && (
                <div className="add-edit-form-container">
                    <h4>Datos del usuario</h4>
                    <form className="add-edit-form" onSubmit={handleSubmit}>
                        <div className="form-group-row">
                            <div className="form-group">
                                <label>Nombre <span className="text-danger">*</span></label>
                                <input name="nombre" type="text" value={form.nombre} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Apellido <span className="text-danger">*</span></label>
                                <input name="apellido" type="text" value={form.apellido} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="form-group-row">
                            <div className="form-group">
                                <label>Tipo de documento</label>
                                <select name="tipoDocumento" value={form.tipoDocumento} onChange={handleChange}>
                                    <option value="CC">CC</option>
                                    <option value="TI">TI</option>
                                    <option value="CE">CE</option>
                                    <option value="PAS">PAS</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Numero de documento <span className="text-danger">*</span></label>
                                <input name="numeroDocumento" type="text" value={form.numeroDocumento} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="form-group-row">
                            <div className="form-group">
                                <label>Direccion <span className="text-danger">*</span></label>
                                <input name="direccion" type="text" value={form.direccion} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Telefono <span className="text-danger">*</span></label>
                                <input name="telefono" type="tel" value={form.telefono} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="form-group-row">
                            <div className="form-group">
                                <label>Correo electronico <span className="text-danger">*</span></label>
                                <input name="email" type="email" value={form.email} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Contrasena <span className="text-danger">*</span></label>
                                <input name="password" type="password" value={form.password} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary" disabled={submitting}>
                                <i className="fas fa-save icon-btn"></i>
                                {submitting ? 'Guardando...' : 'Guardar usuario'}
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
                            placeholder="Buscar por nombre, correo o documento..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </div>
                </div>

                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Documento</th>
                            <th>Telefono</th>
                            <th>Rol</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="text-center">Cargando usuarios...</td>
                            </tr>
                        ) : filteredUsuarios.length > 0 ? (
                            filteredUsuarios.map((user) => (
                                <tr key={user.id}>
                                    <td>#{user.id}</td>
                                    <td>{getFullName(user)}</td>
                                    <td>{user.email || '-'}</td>
                                    <td>{user.perfil?.numeroDocumento || '-'}</td>
                                    <td>{user.perfil?.telefono || '-'}</td>
                                    <td>{getRoleName(user)}</td>
                                    <td><span className="badge bg-success">Activo</span></td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">No hay usuarios para mostrar.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default AdminUsers;
