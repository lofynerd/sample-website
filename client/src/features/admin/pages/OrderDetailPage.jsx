import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock } from 'lucide-react';
import AdminPageHeader from '../components/AdminPageHeader.jsx';
import { getOrder, updateOrderStatus } from '../../../api/adminApi.js';

const STATUSES = ['pending', 'completed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [note, setNote] = useState('');
  const [nextStatus, setNextStatus] = useState('');

  const refresh = () => getOrder(id).then((data) => {
    setOrder(data);
    setNextStatus(data.status);
  });

  useEffect(() => {
    refresh().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusUpdate = async () => {
    if (nextStatus === order.status) return;
    setUpdating(true);
    try {
      await updateOrderStatus(id, nextStatus, note || undefined);
      setNote('');
      await refresh();
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <>
        <AdminPageHeader title="Order" />
        <div className="p-8 text-white/50 text-sm">Loading…</div>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <AdminPageHeader title="Order Not Found" />
        <div className="p-8">
          <Link to="/admin/orders" className="text-sm text-white/60 underline">
            Back to orders
          </Link>
        </div>
      </>
    );
  }

  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
  const address = order.shippingAddress;

  return (
    <>
      <AdminPageHeader
        title={order.orderId}
        description={`Placed ${new Date(order.createdAt).toLocaleString()}`}
        action={
          <Link
            to="/admin/orders"
            className="flex items-center gap-2 text-xs uppercase tracking-widest2 text-white/60 hover:text-white"
          >
            <ArrowLeft size={14} /> Back to Orders
          </Link>
        }
      />

      <div className="p-8 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Products */}
          <div className="bg-white/5 border border-white/10 p-6">
            <h2 className="text-xs uppercase tracking-widest2 text-white/50 mb-4">
              Products ({itemCount})
            </h2>
            <table className="w-full text-sm">
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0">
                    <td className="py-3">{item.name}</td>
                    <td className="py-3 text-white/50 text-right">× {item.quantity}</td>
                    <td className="py-3 text-right w-24">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between pt-4 mt-2 border-t border-white/10 font-display text-lg">
              <span>Subtotal</span>
              <span>${order.subtotal?.toFixed(2)}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white/5 border border-white/10 p-6">
            <h2 className="text-xs uppercase tracking-widest2 text-white/50 mb-4 flex items-center gap-2">
              <Clock size={14} /> Status Timeline
            </h2>
            <div className="flex flex-col gap-4">
              {order.statusHistory?.slice().reverse().map((event, i) => (
                <div key={i} className="flex gap-4 text-sm">
                  <span className="w-2 h-2 rounded-full bg-white/40 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="capitalize">{event.status}</p>
                    {event.note && <p className="text-white/50 text-xs mt-0.5">{event.note}</p>}
                    <p className="text-white/40 text-xs mt-0.5">
                      {new Date(event.at).toLocaleString()} &middot; {event.changedBy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Customer */}
          <div className="bg-white/5 border border-white/10 p-6">
            <h2 className="text-xs uppercase tracking-widest2 text-white/50 mb-4">Customer</h2>
            <p className="text-sm">{order.customerName || '—'}</p>
            <p className="text-sm text-white/60">{order.email}</p>
          </div>

          {/* Address */}
          <div className="bg-white/5 border border-white/10 p-6">
            <h2 className="text-xs uppercase tracking-widest2 text-white/50 mb-4 flex items-center gap-2">
              <MapPin size={14} /> Shipping Address
            </h2>
            {address ? (
              <address className="text-sm text-white/70 not-italic leading-relaxed">
                {address.line1}
                {address.line2 && <>, {address.line2}</>}
                <br />
                {address.city}, {address.region} {address.postalCode}
                <br />
                {address.country}
              </address>
            ) : (
              <p className="text-sm text-white/40">No address on file.</p>
            )}
          </div>

          {/* Update status */}
          <div className="bg-white/5 border border-white/10 p-6">
            <h2 className="text-xs uppercase tracking-widest2 text-white/50 mb-4">Update Status</h2>
            <select
              value={nextStatus}
              onChange={(e) => setNextStatus(e.target.value)}
              className="w-full bg-white/5 border border-white/10 px-3 py-2 text-sm mb-3 focus:outline-none focus:border-white/40"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note"
              rows={2}
              className="w-full bg-white/5 border border-white/10 px-3 py-2 text-sm mb-3 focus:outline-none focus:border-white/40"
            />
            <button
              onClick={handleStatusUpdate}
              disabled={updating || nextStatus === order.status}
              className="w-full px-4 py-2.5 text-xs uppercase tracking-widest2 bg-white text-ink hover:bg-white/90 disabled:opacity-40"
            >
              {updating ? 'Updating…' : 'Update Status'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
