import { useEffect, useState } from 'react';
import AdminPageHeader from '../components/AdminPageHeader.jsx';
import Pagination from '../components/Pagination.jsx';
import { getAuditLog } from '../../../api/adminApi.js';

const PAGE_SIZE = 25;

const ACTION_COLORS = {
  create: 'text-green-400',
  update: 'text-yellow-400',
  delete: 'text-red-400',
};

function formatValue(value) {
  if (value === undefined || value === null) return '—';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export default function AdminAuditLogPage() {
  const [entries, setEntries] = useState([]);
  const [count, setCount] = useState(0);
  const [entityType, setEntityType] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAuditLog({ entityType: entityType || undefined, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE })
      .then((data) => {
        setEntries(data.results);
        setCount(data.count);
      })
      .finally(() => setLoading(false));
  }, [entityType, page]);

  return (
    <>
      <AdminPageHeader
        title="Audit Log"
        description="Every create, edit, and delete performed in the admin panel"
        action={
          <select
            value={entityType}
            onChange={(e) => {
              setEntityType(e.target.value);
              setPage(1);
            }}
            className="bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-white/40"
          >
            <option value="">All entities</option>
            <option value="product">Products</option>
            <option value="article">Journal</option>
            <option value="order">Orders</option>
          </select>
        }
      />

      <div className="p-8">
        {loading ? (
          <p className="text-white/50 text-sm">Loading…</p>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-widest2 text-white/40 border-b border-white/10">
                  <th className="py-3 pr-4">Entity</th>
                  <th className="py-3 pr-4">Action</th>
                  <th className="py-3 pr-4">Changes</th>
                  <th className="py-3 pr-4">Edited By</th>
                  <th className="py-3 pr-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry._id} className="border-b border-white/5 align-top">
                    <td className="py-4 pr-4">
                      <span className="text-white/40 text-xs uppercase tracking-wide block">
                        {entry.entityType}
                      </span>
                      {entry.entityLabel}
                    </td>
                    <td className={`py-4 pr-4 capitalize ${ACTION_COLORS[entry.action] ?? ''}`}>
                      {entry.action}
                    </td>
                    <td className="py-4 pr-4">
                      {entry.changes?.length > 0 ? (
                        <ul className="space-y-1">
                          {entry.changes.map((change) => (
                            <li key={change.field} className="text-xs">
                              <span className="text-white/50">{change.field}:</span>{' '}
                              <span className="text-white/40 line-through mr-1">
                                {formatValue(change.previousValue)}
                              </span>
                              →<span className="ml-1">{formatValue(change.newValue)}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-white/30 text-xs">—</span>
                      )}
                    </td>
                    <td className="py-4 pr-4 text-white/60">{entry.editedBy}</td>
                    <td className="py-4 pr-4 text-white/60 text-xs whitespace-nowrap">
                      {new Date(entry.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {entries.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-white/40">
                      No audit log entries yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <Pagination page={page} pageSize={PAGE_SIZE} total={count} onPageChange={setPage} />
          </>
        )}
      </div>
    </>
  );
}
