import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { getUser } from '../../helpers/auth';
import { getPerfilPorId, getUsuarioPorId } from '../../services/api';

const getDisplayName = (user) => {
    const fullName = [user?.nombre, user?.apellido].filter(Boolean).join(' ').trim();
    return fullName || user?.name || user?.email || 'Administrador';
};

const AdminProfile = () => {
    const user = getUser();
    const [profile, setProfile] = useState(user);
    const [loading, setLoading] = useState(Boolean(user?.id));

    useEffect(() => {
        if (!user?.id) return;

        let cancelled = false;

        const loadProfile = async () => {
            try {
                const usuarioData = await getUsuarioPorId(user.id).catch(() => user);
                const perfilId = usuarioData.perfilId ?? usuarioData.perfil?.id ?? user.perfilId ?? user.perfil?.id;
                let perfilData = usuarioData.perfil ?? user.perfil ?? null;

                if (!perfilData && perfilId) {
                    perfilData = await getPerfilPorId(perfilId).catch(() => null);
                }

                if (!cancelled) {
                    setProfile({
                        ...user,
                        ...perfilData,
                        ...usuarioData,
                        perfil: perfilData,
                        perfilId,
                    });
                }
            } catch (error) {
                console.error('No se pudo cargar el perfil del administrador:', error);
                if (!cancelled) setProfile(user);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        void loadProfile();

        return () => {
            cancelled = true;
        };
    }, [user]);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const nombre = getDisplayName(profile);
    const tipoUsuario = profile?.tipoUsuario || profile?.rolDescripcion || profile?.rol?.descripcion || profile?.rol || 'Administrador';
    const initials = nombre
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');

    const profileItems = [
        { label: 'Nombre', value: nombre },
        { label: 'Correo electronico', value: profile?.email || '-' },
        { label: 'Tipo de usuario', value: tipoUsuario },
        { label: 'Rol', value: profile?.rol?.descripcion || profile?.rolDescripcion || profile?.rol || '-' },
        { label: 'Tipo de documento', value: profile?.tipoDocumento || profile?.documentType || '-' },
        { label: 'Numero de documento', value: profile?.numeroDocumento || profile?.documentNumber || '-' },
        { label: 'Telefono', value: profile?.telefono || profile?.phone || '-' },
        { label: 'Direccion', value: profile?.direccion || profile?.address || '-' },
        { label: 'Identificador', value: profile?.id || user.id || '-' },
        { label: 'Estado de sesion', value: loading ? 'Actualizando' : 'Activa' },
    ];

    return (
        <section className="admin-profile">
            <div className="header-content">
                <div>
                    <h1>Perfil del administrador</h1>
                    <p className="breadcrumb">Admin / Perfil</p>
                </div>
                <Link to="/admin/dashboard" className="btn btn-light">
                    <i className="fas fa-arrow-left icon-btn"></i>
                    Volver al dashboard
                </Link>
            </div>

            <article className="admin-profile-card">
                <div className="admin-profile-identity">
                    <div className="admin-profile-avatar" aria-hidden="true">
                        {initials || 'A'}
                    </div>
                    <div>
                        <span className="admin-profile-kicker">{loading ? 'Consultando backend' : 'Sesion activa'}</span>
                        <h2>{nombre}</h2>
                        <p>{tipoUsuario}</p>
                    </div>
                </div>

                <div className="admin-profile-grid">
                    {profileItems.map((item) => (
                        <div className="admin-profile-detail" key={item.label}>
                            <span>{item.label}</span>
                            <strong>{item.value}</strong>
                        </div>
                    ))}
                </div>
            </article>
        </section>
    );
};

export default AdminProfile;
