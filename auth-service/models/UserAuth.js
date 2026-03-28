const mongoose = require('mongoose');

const userAuthSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String, required: true },
    roles: { type: [String], default: ['user'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserAuth', userAuthSchema);
