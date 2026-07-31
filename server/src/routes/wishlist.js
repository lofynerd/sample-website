import { Router } from 'express';
import User from '../models/User.js';
import { logger } from '../lib/logs.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

// GET /api/v1/wishlist - returns the authenticated user's saved product ids
router.get('/', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.sub);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ productIds: user.wishlist });
  } catch (err) {
    logger.emit({ severityText: 'error', body: 'failed to fetch wishlist', attributes: { error: err.message } });
    res.status(500).json({ error: 'Could not fetch wishlist' });
  }
});

// PUT /api/v1/wishlist - replaces the authenticated user's wishlist (used to sync/merge on login)
router.put('/', requireAuth, async (req, res) => {
  const { productIds } = req.body ?? {};
  if (!Array.isArray(productIds)) {
    return res.status(400).json({ error: 'productIds must be an array' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user.sub,
      { wishlist: [...new Set(productIds)] },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ productIds: user.wishlist });
  } catch (err) {
    logger.emit({ severityText: 'error', body: 'failed to update wishlist', attributes: { error: err.message } });
    res.status(500).json({ error: 'Could not update wishlist' });
  }
});

// POST /api/v1/wishlist/:productId - adds a single product id to the wishlist
router.post('/:productId', requireAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.sub,
      { $addToSet: { wishlist: req.params.productId } },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ productIds: user.wishlist });
  } catch (err) {
    logger.emit({ severityText: 'error', body: 'failed to add to wishlist', attributes: { error: err.message } });
    res.status(500).json({ error: 'Could not update wishlist' });
  }
});

// DELETE /api/v1/wishlist/:productId - removes a single product id from the wishlist
router.delete('/:productId', requireAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.sub,
      { $pull: { wishlist: req.params.productId } },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ productIds: user.wishlist });
  } catch (err) {
    logger.emit({ severityText: 'error', body: 'failed to remove from wishlist', attributes: { error: err.message } });
    res.status(500).json({ error: 'Could not update wishlist' });
  }
});

export default router;
