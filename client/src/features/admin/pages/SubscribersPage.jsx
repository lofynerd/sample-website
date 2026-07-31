import { useEffect, useState } from 'react';
import AdminPageHeader from '../components/AdminPageHeader.jsx';
import { getSubscribers } from '../../../api/adminApi.js';

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSubscribers({ limit: 100 })
      .then((data) => {
        setSubscribers(data.results);
        setCount(data.count);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <AdminPageHeader
        title="Subscribers"
        description={`${count} newsletter subscriber${count === 1 ? '' : 's'}`}
      />
      <div className="p-8">
        {loading ? (
          <p className="text-white/50 text-sm">Loading…</p>
        ) : (
          <table className="w-full text-sm max-w-xl">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest2 text-white/40 border-b border-white/10">
                <th className="py-3 pr-4">Email</th>
                <th className="py-3 pr-4">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub._id} className="border-b border-white/5">
                  <td className="py-4 pr-4">{sub.email}</td>
                  <td className="py-4 pr-4 text-white/60">
                    {new Date(sub.subscribedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr>
                  <td colSpan={2} className="py-8 text-center text-white/40">
                    No subscribers yet.
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
