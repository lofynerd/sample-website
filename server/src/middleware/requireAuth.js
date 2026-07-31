import jwt from 'jsonwebtoken';

// Protects customer-only routes: expects "Authorization: Bearer <token>" issued by /api/v1/auth/login
export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return res.status(401).json({ error: 'Missing authentication token' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== 'customer') throw new Error('Not a customer token');
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired session' });
  }
}

// Attaches req.user if a valid token is present, but doesn't reject the request otherwise
export function optionalAuth(req, _res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role === 'customer') req.user = payload;
  } catch {
    // ignore invalid/expired tokens for optional auth
  }
  next();
}
