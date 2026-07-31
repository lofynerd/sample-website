import { Router } from 'express';
import Article from '../models/Article.js';
import { logger } from '../lib/logs.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();

// GET /api/v1/journal - list articles, supports pagination and category filtering
router.get('/', async (req, res) => {
  const { category, limit = 20, offset = 0, sort = '-date' } = req.query;

  const filter = {};
  if (category) filter.category = category;

  try {
    const [results, count] = await Promise.all([
      Article.find(filter)
        .sort(sort)
        .skip(Number(offset))
        .limit(Math.min(Number(limit), 100)),
      Article.countDocuments(filter),
    ]);

    res.json({ count, results });
  } catch (err) {
    logger.emit({ severityText: 'error', body: 'failed to list articles', attributes: { error: err.message } });
    res.status(500).json({ error: 'Could not fetch articles' });
  }
});

// POST /api/v1/journal - admin-only: create an article
router.post('/', requireAdmin, async (req, res) => {
  try {
    const article = await Article.create(req.body);
    res.status(201).json(article);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'An article with this slug already exists' });
    }
    logger.emit({ severityText: 'error', body: 'failed to create article', attributes: { error: err.message } });
    res.status(400).json({ error: err.message });
  }
});

// GET /api/v1/journal/:slug - retrieve a single article by slug
router.get('/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug.toLowerCase() });
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (err) {
    logger.emit({ severityText: 'error', body: 'failed to fetch article', attributes: { error: err.message } });
    res.status(500).json({ error: 'Could not fetch article' });
  }
});

// PATCH /api/v1/journal/id/:id - admin-only: update an article by Mongo _id
router.patch('/id/:id', requireAdmin, async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (err) {
    logger.emit({ severityText: 'error', body: 'failed to update article', attributes: { error: err.message } });
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/v1/journal/id/:id - admin-only: delete an article by Mongo _id
router.delete('/id/:id', requireAdmin, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.status(204).end();
  } catch (err) {
    logger.emit({ severityText: 'error', body: 'failed to delete article', attributes: { error: err.message } });
    res.status(500).json({ error: 'Could not delete article' });
  }
});

export default router;
