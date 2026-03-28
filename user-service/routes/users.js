const express = require('express');
const UserProfile = require('../models/UserProfile');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/profiles', requireAuth, async (req, res) => {
  try {
    const profiles = await UserProfile.find().sort({ createdAt: -1 }).limit(100).lean();
    return res.json({ success: true, profiles });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch profiles', details: error.message });
  }
});

router.get('/profile/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.sub !== id && !(req.user.roles || []).includes('admin')) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const profile = await UserProfile.findOne({ auth_user_id: id }).lean();
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    return res.json({ success: true, profile });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch profile', details: error.message });
  }
});

router.put('/profile/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.sub !== id && !(req.user.roles || []).includes('admin')) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { email, name, phone, avatar } = req.body;
    const profile = await UserProfile.findOneAndUpdate(
      { auth_user_id: id },
      {
        $set: {
          auth_user_id: id,
          email: email || req.user.email || '',
          name: name || '',
          phone: phone || '',
          avatar: avatar || '',
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return res.json({ success: true, profile });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update profile', details: error.message });
  }
});

module.exports = router;
