import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import AdminPageHeader from '../components/AdminPageHeader.jsx';
import ProductForm from '../components/ProductForm.jsx';
import { getProducts } from '../../../api/productsApi.js';
import { createProduct, updateProduct, deleteProduct } from '../../../api/adminApi.js';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, product = edit
  const [deletingId, setDeletingId] = useState(null);

  const refresh = () => getProducts({ limit: 100 }).then(setProducts);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  const handleSave = async (payload) => {
    if (editing?._id) {
      await updateProduct(editing._id, payload);
    } else {
      await createProduct(payload);
    }
    setEditing(null);
    await refresh();
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeletingId(product._id);
    try {
      await deleteProduct(product._id);
      await refresh();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Products"
        description={`${products.length} item${products.length === 1 ? '' : 's'} in the catalog`}
        action={
          <button
            onClick={() => setEditing({})}
            className="flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-widest2 bg-white text-ink hover:bg-white/90"
          >
            <Plus size={14} /> New Product
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
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Category</th>
                <th className="py-3 pr-4">Collection</th>
                <th className="py-3 pr-4">Price</th>
                <th className="py-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b border-white/5">
                  <td className="py-4 pr-4">{product.name}</td>
                  <td className="py-4 pr-4 text-white/60">{product.category}</td>
                  <td className="py-4 pr-4 text-white/60">{product.collection}</td>
                  <td className="py-4 pr-4">${product.price?.toFixed(2)}</td>
                  <td className="py-4 pr-4 text-right">
                    <button
                      onClick={() => setEditing(product)}
                      aria-label={`Edit ${product.name}`}
                      className="p-2 text-white/60 hover:text-white"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      aria-label={`Delete ${product.name}`}
                      disabled={deletingId === product._id}
                      className="p-2 text-white/60 hover:text-red-400 disabled:opacity-40"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-white/40">
                    No products yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {editing !== null && (
        <ProductForm
          product={editing._id ? editing : null}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}
