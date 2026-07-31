import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import CustomCursor from '../components/ui/CustomCursor.jsx';

export default function Layout() {
  return (
    <div className="min-h-screen bg-bone text-ink flex flex-col">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <CustomCursor />
      <Navbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
