import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Package, LogOut } from 'lucide-react';
import Reveal from '../../components/ui/Reveal.jsx';
import Button from '../../components/ui/Button.jsx';
import useAuthStore from '../../store/useAuthStore.js';
import { getMyOrders } from '../../api/authApi.js';

export default function AccountPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <Helmet>
        <title>My Account — Maison Delulu</title>
      </Helmet>

      <div className="pt-32 md:pt-40 px-6 md:px-10 max-w-3xl mx-auto pb-32">
        <div className="flex items-start justify-between mb-16 flex-wrap gap-6">
          <Reveal>
            <span className="text-xs uppercase tracking-widest2 text-stone">My Account</span>
            <h1 className="font-display text-display mt-6">
              {user?.name ? `Welcome, ${user.name.split(' ')[0]}` : 'Your Account'}
            </h1>
            <p className="text-stone mt-2">{user?.email}</p>
            {user && !user.isEmailVerified && (
              <p className="text-xs text-accent mt-2">
                Your email isn't verified yet — check your inbox for a verification link.
              </p>
            )}
          </Reveal>
          <Reveal delay={0.1}>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut size={14} className="inline mr-2" />
              Sign Out
            </Button>
          </Reveal>
        </div>

        <Reveal>
          <h2 className="font-display text-xl mb-6 flex items-center gap-2">
            <Package size={18} strokeWidth={1.5} />
            Order History
          </h2>
        </Reveal>

        {loading ? (
          <p className="text-stone text-sm">Loading…</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 border-t border-mist">
            <p className="text-stone mb-8">You haven't placed an order yet.</p>
            <Button as={Link} to="/collections" variant="ghost">
              Browse Collections
            </Button>
          </div>
        ) : (
          <div className="border-t border-mist">
            {orders.map((order) => (
              <div key={order._id} className="flex justify-between py-5 border-b border-mist text-sm">
                <div>
                  <p className="font-mono text-xs text-stone mb-1">{order.orderId}</p>
                  <p>
                    {order.items.reduce((sum, i) => sum + i.quantity, 0)} item
                    {order.items.reduce((sum, i) => sum + i.quantity, 0) === 1 ? '' : 's'}
                  </p>
                </div>
                <div className="text-right">
                  <p>${order.subtotal?.toFixed(2)}</p>
                  <p className="text-stone text-xs mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
