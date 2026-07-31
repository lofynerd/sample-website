import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DollarSign, ShoppingBag, Mail, Package, Eye, Users, AlertTriangle } from 'lucide-react';
import AdminPageHeader from '../components/AdminPageHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import { getBusinessAnalytics, getPosthogAnalytics } from '../../../api/adminApi.js';

const CHART_COLOR = '#e5e5e5';
const GRID_COLOR = 'rgba(255,255,255,0.08)';

export default function AdminDashboardPage() {
  const [business, setBusiness] = useState(null);
  const [posthogData, setPosthogData] = useState(null);
  const [posthogError, setPosthogError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getBusinessAnalytics().then(setBusiness),
      getPosthogAnalytics()
        .then(setPosthogData)
        .catch((err) => setPosthogError(err.response?.data?.error ?? 'Could not load PostHog metrics')),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <AdminPageHeader title="Dashboard" description="Store performance and website analytics" />
        <div className="p-8 text-white/50 text-sm">Loading…</div>
      </>
    );
  }

  return (
    <>
      <AdminPageHeader title="Dashboard" description="Store performance and website analytics" />

      <div className="p-8 space-y-10">
        {/* Business metrics */}
        <section>
          <h2 className="text-xs uppercase tracking-widest2 text-white/40 mb-4">Store</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard label="Revenue" value={`$${business.totalRevenue.toFixed(2)}`} icon={DollarSign} />
            <StatCard label="Orders" value={business.orderCount} icon={ShoppingBag} />
            <StatCard label="Subscribers" value={business.subscriberCount} icon={Mail} />
            <StatCard label="Products" value={business.productCount} icon={Package} />
          </div>

          {business.ordersByDay.length > 0 && (
            <div className="bg-white/5 border border-white/10 p-6 mb-6">
              <h3 className="text-xs uppercase tracking-widest2 text-white/50 mb-4">
                Revenue by Day
              </h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={business.ordersByDay}>
                  <CartesianGrid stroke={GRID_COLOR} vertical={false} />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
                  <Tooltip
                    contentStyle={{ background: '#161617', border: '1px solid rgba(255,255,255,0.1)' }}
                    labelStyle={{ color: CHART_COLOR }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#8a7159" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {business.topProducts.length > 0 && (
            <div className="bg-white/5 border border-white/10 p-6">
              <h3 className="text-xs uppercase tracking-widest2 text-white/50 mb-4">
                Top Selling Products
              </h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={business.topProducts} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid stroke={GRID_COLOR} horizontal={false} />
                  <XAxis type="number" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="rgba(255,255,255,0.4)"
                    fontSize={11}
                    width={140}
                  />
                  <Tooltip
                    contentStyle={{ background: '#161617', border: '1px solid rgba(255,255,255,0.1)' }}
                    labelStyle={{ color: CHART_COLOR }}
                  />
                  <Bar dataKey="quantity" fill="#8a7159" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        {/* PostHog metrics */}
        <section>
          <h2 className="text-xs uppercase tracking-widest2 text-white/40 mb-4">
            Website Analytics (PostHog, last 30 days)
          </h2>

          {posthogError ? (
            <div className="bg-white/5 border border-white/10 p-6 flex items-start gap-3">
              <AlertTriangle size={18} className="text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-white/80 mb-1">Live PostHog metrics unavailable</p>
                <p className="text-xs text-white/50">{posthogError}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <StatCard label="Pageviews" value={posthogData.pageviews} icon={Eye} />
                <StatCard label="Unique Visitors" value={posthogData.uniqueVisitors} icon={Users} />
                <StatCard label="Exceptions" value={posthogData.exceptionCount} icon={AlertTriangle} />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 p-6">
                  <h3 className="text-xs uppercase tracking-widest2 text-white/50 mb-4">Top Pages</h3>
                  <ul className="space-y-2">
                    {posthogData.topPages.map((p) => (
                      <li key={p.path} className="flex justify-between text-sm">
                        <span className="text-white/70 truncate">{p.path}</span>
                        <span className="text-white/40">{p.views}</span>
                      </li>
                    ))}
                    {posthogData.topPages.length === 0 && (
                      <li className="text-white/40 text-sm">No pageview data yet.</li>
                    )}
                  </ul>
                </div>

                <div className="bg-white/5 border border-white/10 p-6">
                  <h3 className="text-xs uppercase tracking-widest2 text-white/50 mb-4">Top Events</h3>
                  <ul className="space-y-2">
                    {posthogData.topEvents.map((e) => (
                      <li key={e.event} className="flex justify-between text-sm">
                        <span className="text-white/70 truncate">{e.event}</span>
                        <span className="text-white/40">{e.total}</span>
                      </li>
                    ))}
                    {posthogData.topEvents.length === 0 && (
                      <li className="text-white/40 text-sm">No event data yet.</li>
                    )}
                  </ul>
                </div>
              </div>
            </>
          )}

          <a
            href="https://us.posthog.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 text-xs uppercase tracking-widest2 text-white/50 hover:text-white border-b border-white/20 hover:border-white pb-1"
          >
            Open full PostHog project →
          </a>
        </section>
      </div>
    </>
  );
}
