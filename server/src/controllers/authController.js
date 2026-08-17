import { generateToken } from '../middleware/auth.js';
import dotenv from 'dotenv';
dotenv.config();

const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'roofing2026!';

export function loginOwner(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = generateToken(username);
    return res.json({
      success: true,
      token,
      user: {
        username: ADMIN_USER,
        role: 'owner'
      }
    });
  }

  return res.status(401).json({ error: 'Invalid username or password credentials.' });
}

export function checkAuth(req, res) {
  return res.json({
    authenticated: true,
    user: req.user
  });
}
