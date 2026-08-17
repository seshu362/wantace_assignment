import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'roofing2026!';
const JWT_SECRET = process.env.JWT_SECRET || 'roofing_estimator_secret_key_2026';

export function authenticateOwner(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Owner Panel"');
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Support 1: Bearer JWT Token
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired authentication token' });
    }
  }

  // Support 2: Basic HTTP Auth
  if (authHeader.startsWith('Basic ')) {
    const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('ascii').split(':');
    const user = credentials[0];
    const pass = credentials[1];

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      req.user = { username: user, role: 'admin' };
      return next();
    }
  }

  res.setHeader('WWW-Authenticate', 'Basic realm="Owner Panel"');
  return res.status(401).json({ error: 'Invalid credentials' });
}

export function generateToken(user) {
  return jwt.sign({ username: user, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
}
