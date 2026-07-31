import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import AdminPageHeader from '../components/AdminPageHeader.jsx';
import ArticleForm from '../components/ArticleForm.jsx';
import { getArticles } from '../../../api/journalApi.js';
import { createArticle, updateArticle, deleteArticle } from '../../../api/adminApi.js';

export default function AdminJournalPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const refresh = () => getArticles({ limit: 100 }).then(setArticles);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  const handleSave = async (payload) => {
    if (editing?._id) {
      await updateArticle(editing._id, payload);
    } else {
      await createArticle(payload);
    }
    setEditing(null);
    await refresh();
  };

  const handleDelete = async (article) => {
    if (!window.confirm(`Delete "${article.title}"? This cannot be undone.`)) return;
    setDeletingId(article._id);
    try {
      await deleteArticle(article._id);
      await refresh();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Journal"
        description={`${articles.length} article${articles.length === 1 ? '' : 's'} published`}
        action={
          <button
            onClick={() => setEditing({})}
            className="flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-widest2 bg-white text-ink hover:bg-white/90"
          >
            <Plus size={14} /> New Article
          </button>
        }
      />

      <div className="p-8">
        {loading ? (
          <p className="text-white/50 text-sm">Loading…</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest2 text-white/40 border-b border-white/10">
                <th className="py-3 pr-4">Title</th>
                <th className="py-3 pr-4">Category</th>
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article._id} className="border-b border-white/5">
                  <td className="py-4 pr-4">{article.title}</td>
                  <td className="py-4 pr-4 text-white/60">{article.category}</td>
                  <td className="py-4 pr-4 text-white/60">
                    {new Date(article.date).toLocaleDateString()}
                  </td>
                  <td className="py-4 pr-4 text-right">
                    <button
                      onClick={() => setEditing(article)}
                      aria-label={`Edit ${article.title}`}
                      className="p-2 text-white/60 hover:text-white"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(article)}
                      aria-label={`Delete ${article.title}`}
                      disabled={deletingId === article._id}
                      className="p-2 text-white/60 hover:text-red-400 disabled:opacity-40"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {articles.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-white/40">
                    No articles yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {editing !== null && (
        <ArticleForm
          article={editing._id ? editing : null}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}
