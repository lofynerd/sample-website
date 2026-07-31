import { useState } from 'react';
import { X } from 'lucide-react';

const EMPTY_ARTICLE = {
  slug: '',
  title: '',
  category: '',
  date: '',
  image: '',
  excerpt: '',
  body: '',
};

function toFormState(article) {
  if (!article) return { ...EMPTY_ARTICLE, date: new Date().toISOString().slice(0, 10) };
  return {
    ...EMPTY_ARTICLE,
    ...article,
    date: article.date ? new Date(article.date).toISOString().slice(0, 10) : '',
    body: (article.body ?? []).join('\n\n'),
  };
}

function toPayload(form) {
  return {
    slug: form.slug.trim().toLowerCase(),
    title: form.title.trim(),
    category: form.category.trim(),
    date: form.date ? new Date(form.date) : new Date(),
    image: form.image.trim(),
    excerpt: form.excerpt.trim(),
    body: form.body.split('\n\n').map((p) => p.trim()).filter(Boolean),
  };
}

export default function ArticleForm({ article, onSave, onClose }) {
  const [form, setForm] = useState(() => toFormState(article));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave(toPayload(form));
    } catch (err) {
      setError(err.response?.data?.error ?? 'Something went wrong saving this article.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-white/40';
  const labelClass = 'text-xs uppercase tracking-widest2 text-white/50 mb-1.5 block';

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
      <div className="bg-[#161617] border border-white/10 max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-[#161617]">
          <h2 className="font-display text-xl">{article ? 'Edit Article' : 'New Article'}</h2>
          <button onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Title</label>
              <input required value={form.title} onChange={update('title')} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Slug</label>
              <input required value={form.slug} onChange={update('slug')} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Category</label>
              <input value={form.category} onChange={update('category')} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Date</label>
              <input type="date" value={form.date} onChange={update('date')} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Cover image URL</label>
            <input value={form.image} onChange={update('image')} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Excerpt</label>
            <textarea rows={2} value={form.excerpt} onChange={update('excerpt')} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Body (paragraphs separated by a blank line)</label>
            <textarea rows={8} value={form.body} onChange={update('body')} className={inputClass} />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs uppercase tracking-widest2 text-white/60 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 text-xs uppercase tracking-widest2 bg-white text-ink hover:bg-white/90 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
