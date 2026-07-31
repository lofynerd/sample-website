import { Router } from 'express';
import Product from '../models/Product.js';
import { logger } from '../lib/logs.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();

// GET /api/v1/products - list products, supports pagination, filtering, and sorting
router.get('/', async (req, res) => {
  const { collection, category, limit = 20, offset = 0, sort = '-createdAt' } = req.query;

  const filter = {};
  if (collection) filter.collection = collection;
  if (category) filter.category = { $in: category.split(',') };

  try {
    const [results, count] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(Number(offset))
        .limit(Math.min(Number(limit), 100)),
      Product.countDocuments(filter),
    ]);

    res.json({ count, results });
  } catch (err) {
    logger.emit({ severityText: 'error', body: 'failed to list products', attributes: { error: err.message } });
    res.status(500).json({ error: 'Could not fetch products' });
  }
});

// POST /api/v1/products - admin-only: create a product
router.post('/', requireAdmin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'A product with this slug already exists' });
    }
    logger.emit({ severityText: 'error', body: 'failed to create product', attributes: { error: err.message } });
    res.status(400).json({ error: err.message });
  }
});

// GET /api/v1/products/:slug - retrieve a single product by slug
router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug.toLowerCase() });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    logger.emit({ severityText: 'error', body: 'failed to fetch product', attributes: { error: err.message } });
    res.status(500).json({ error: 'Could not fetch product' });
  }
});

// PATCH /api/v1/products/id/:id - admin-only: update a product by Mongo _id
router.patch('/id/:id', requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    logger.emit({ severityText: 'error', body: 'failed to update product', attributes: { error: err.message } });
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/v1/products/id/:id - admin-only: delete a product by Mongo _id
router.delete('/id/:id', requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(204).end();
  } catch (err) {
    logger.emit({ severityText: 'error', body: 'failed to delete product', attributes: { error: err.message } });
    res.status(500).json({ error: 'Could not delete product' });
  }
});

export default router;
