import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Newspaper, ShoppingBag, Mail, LogOut } from 'lucide-react';
import useAdminAuthStore from '../../store/useAdminAuthStore.js';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/journal', label: 'Journal', icon: Newspaper },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/subscribers', label: 'Subscribers', icon: Mail },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const logout = useAdminAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-[#0e0e0f] text-[#e5e5e5] font-body">
      <aside className="w-60 flex-shrink-0 border-r border-white/10 flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <span className="font-display text-xl tracking-wide">Maison Delulu</span>
          <p className="text-[11px] uppercase tracking-widest2 text-white/40 mt-1">Admin</p>
        </div>
        <nav className="flex-1 py-4">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                  isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon size={16} strokeWidth={1.5} />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-4 text-sm text-white/60 hover:text-white border-t border-white/10"
        >
          <LogOut size={16} strokeWidth={1.5} />
          Sign out
        </button>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
