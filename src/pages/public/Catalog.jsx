import React, { useState, useEffect } from 'react';
import { getLibros } from '../../services/api';

const Catalog = () => {
    // HU08: Inicialización de datos
    const [libros, setLibros] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Carga automática inicial controlada
        const fetchDatos = async () => {
            const data = await getLibros();
            setLibros(data);
            setLoading(false);
        };
        fetchDatos();
    }, []); // Dependencias en vacío para que solo se llame una vez (Evitamos bucle)

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Nuestro Catálogo</h2>
            
            {loading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="row">
                    {libros.map((libro) => (
                        <div className="col-md-4 mb-4" key={libro.id}>
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title text-capitalize">{libro.titulo}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">{libro.categoria}</h6>
                                    <p className="card-text">{libro.descripcion.substring(0, 80)}...</p>
                                    <span className={`badge ${libro.disponible ? 'bg-success' : 'bg-danger'}`}>
                                        {libro.disponible ? 'Disponible' : 'Prestado'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Catalog;
