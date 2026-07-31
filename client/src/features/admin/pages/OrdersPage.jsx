import { useEffect, useState } from 'react';
import AdminPageHeader from '../components/AdminPageHeader.jsx';
import { getOrders } from '../../../api/adminApi.js';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders({ limit: 50 })
      .then((data) => {
        setOrders(data.results);
        setCount(data.count);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <AdminPageHeader title="Orders" description={`${count} order${count === 1 ? '' : 's'} placed`} />
      <div className="p-8">
        {loading ? (
          <p className="text-white/50 text-sm">Loading…</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest2 text-white/40 border-b border-white/10">
                <th className="py-3 pr-4">Order</th>
                <th className="py-3 pr-4">Email</th>
                <th className="py-3 pr-4">Items</th>
                <th className="py-3 pr-4">Subtotal</th>
                <th className="py-3 pr-4">Placed</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-white/5">
                  <td className="py-4 pr-4 font-mono text-xs">{order.orderId}</td>
                  <td className="py-4 pr-4 text-white/60">{order.email}</td>
                  <td className="py-4 pr-4 text-white/60">
                    {order.items.reduce((sum, i) => sum + i.quantity, 0)}
                  </td>
                  <td className="py-4 pr-4">${order.subtotal?.toFixed(2)}</td>
                  <td className="py-4 pr-4 text-white/60">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-white/40">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
