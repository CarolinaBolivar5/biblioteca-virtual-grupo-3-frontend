import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mt-5 text-center">
      <h1 className="mb-4">Bienvenido a la Biblioteca Virtual</h1>
      <p className="lead">Explora cientos de libros, cómics y títulos de ciencia en un solo lugar.</p>
      <div className="mt-4">
        <Link to="/catalog" className="btn btn-primary btn-lg me-3">Ver Catálogo</Link>
      </div>
    </div>
  );
};

export default Home;
