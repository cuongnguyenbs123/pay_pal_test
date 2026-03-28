const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserAuth = require('../models/UserAuth');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES || '15m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES || '7d';

const ACCESS_MAX_AGE_MS = 15 * 60 * 1000;
const REFRESH_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function generateAccessToken(user) {
  return jwt.sign(
    { sub: String(user._id), email: user.email, roles: user.roles, type: 'access' },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN },
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { sub: String(user._id), email: user.email, roles: user.roles, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN },
  );
}

function setAuthCookies(res, { accessToken, refreshToken }) {
  const isProd = process.env.NODE_ENV === 'production';

  if (accessToken) {
    res.cookie('access_token', accessToken, {
      httpOnly: false,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: ACCESS_MAX_AGE_MS,
    });
  }

  if (refreshToken) {
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: REFRESH_MAX_AGE_MS,
    });
  }
}

function getCookieValue(req, name) {
  const header = req.headers.cookie || '';
  const parts = header.split(';').map((p) => p.trim());
  for (const part of parts) {
    const [k, ...rest] = part.split('=');
    if (k === name) return rest.join('=');
  }
  return null;
}

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const existed = await UserAuth.findOne({ email: email.toLowerCase().trim() });
    if (existed) return res.status(409).json({ error: 'Email already exists' });

    const password_hash = await bcrypt.hash(password, 10);
    const user = await UserAuth.create({
      email: email.toLowerCase().trim(),
      password_hash,
      roles: ['user'],
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    setAuthCookies(res, { accessToken, refreshToken });

    return res.status(201).json({
      success: true,
      accessToken,
      user: { id: user._id, email: user.email, roles: user.roles },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to register', details: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const user = await UserAuth.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    setAuthCookies(res, { accessToken, refreshToken });

    return res.json({
      success: true,
      accessToken,
      user: { id: user._id, email: user.email, roles: user.roles },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to login', details: error.message });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = getCookieValue(req, 'refresh_token');
    if (!refreshToken) return res.status(401).json({ error: 'Missing refresh token' });

    const payload = jwt.verify(refreshToken, JWT_SECRET);
    if (!payload || payload.type !== 'refresh') {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    const user = await UserAuth.findById(payload.sub).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });

    const accessToken = generateAccessToken(user);
    setAuthCookies(res, { accessToken });

    return res.json({
      success: true,
      accessToken,
      user: { id: user._id, email: user.email, roles: user.roles },
    });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid refresh token', details: error.message });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await UserAuth.findById(req.user.sub).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({
      success: true,
      user: { id: user._id, email: user.email, roles: user.roles },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to get user', details: error.message });
  }
});

module.exports = router;
