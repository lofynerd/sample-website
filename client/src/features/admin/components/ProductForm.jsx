import { useState } from 'react';
import { X } from 'lucide-react';

const EMPTY_PRODUCT = {
  slug: '',
  name: '',
  price: '',
  collection: '',
  category: '',
  description: '',
  story: '',
  materials: '',
  care: '',
  sizes: '',
  images: '',
  image: '',
  hoverImage: '',
};

// Serializes a product document's array fields into newline/comma text for editing
function toFormState(product) {
  if (!product) return EMPTY_PRODUCT;
  return {
    ...EMPTY_PRODUCT,
    ...product,
    materials: (product.materials ?? []).join('\n'),
    care: (product.care ?? []).join('\n'),
    sizes: (product.sizes ?? []).join(', '),
    images: (product.images ?? []).join('\n'),
  };
}

// Parses the form state back into the shape the API expects
function toPayload(form) {
  return {
    slug: form.slug.trim().toLowerCase(),
    name: form.name.trim(),
    price: Number(form.price),
    collection: form.collection.trim(),
    category: form.category.trim(),
    description: form.description.trim(),
    story: form.story.trim(),
    materials: form.materials.split('\n').map((s) => s.trim()).filter(Boolean),
    care: form.care.split('\n').map((s) => s.trim()).filter(Boolean),
    sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
    images: form.images.split('\n').map((s) => s.trim()).filter(Boolean),
    image: form.image.trim(),
    hoverImage: form.hoverImage.trim(),
    colors: [],
  };
}

export default function ProductForm({ product, onSave, onClose }) {
  const [form, setForm] = useState(() => toFormState(product));
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
      setError(err.response?.data?.error ?? 'Something went wrong saving this product.');
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
          <h2 className="font-display text-xl">{product ? 'Edit Product' : 'New Product'}</h2>
          <button onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Name</label>
              <input required value={form.name} onChange={update('name')} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Slug</label>
              <input required value={form.slug} onChange={update('slug')} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Price (USD)</label>
              <input
                required
                type="number"
                step="0.01"
                value={form.price}
                onChange={update('price')}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <input value={form.category} onChange={update('category')} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Collection</label>
              <input value={form.collection} onChange={update('collection')} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={update('description')}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Story</label>
            <textarea rows={3} value={form.story} onChange={update('story')} className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Materials (one per line)</label>
              <textarea rows={3} value={form.materials} onChange={update('materials')} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Care instructions (one per line)</label>
              <textarea rows={3} value={form.care} onChange={update('care')} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Sizes (comma separated)</label>
            <input value={form.sizes} onChange={update('sizes')} className={inputClass} placeholder="XS, S, M, L, XL" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Primary image URL</label>
              <input value={form.image} onChange={update('image')} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Hover image URL</label>
              <input value={form.hoverImage} onChange={update('hoverImage')} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Gallery image URLs (one per line)</label>
            <textarea rows={3} value={form.images} onChange={update('images')} className={inputClass} />
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
              {saving ? 'Saving…' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
