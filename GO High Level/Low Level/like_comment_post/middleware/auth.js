import jwt from 'jsonwebtoken';

// Authorization: Bearer <JWT>  ->  req.userId
// Runs before every route, so controllers can trust req.userId.
export const requireAuth = (req, res, next) => {
  const [scheme, token] = req.headers.authorization?.split(' ') ?? [];
  if (scheme !== 'Bearer' || !token) {
    return res.sendStatus(401);
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = String(payload.sub);
    next();
  } catch {
    res.sendStatus(401); // bad signature, expired, or no JWT_SECRET set
  }
};
