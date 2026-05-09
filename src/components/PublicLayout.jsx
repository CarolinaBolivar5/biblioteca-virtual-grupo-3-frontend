import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const PublicLayout = () => (
    <div className="public-layout">
        <Navbar />
        <main className="public-layout-main">
            <Outlet />
        </main>
        <Footer />
    </div>
);

export default PublicLayout;
