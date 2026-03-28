const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema(
  {
    auth_user_id: { type: String, required: true, unique: true },
    email: { type: String, default: '' },
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    avatar: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserProfile', userProfileSchema);
