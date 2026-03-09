const asyncHandler = require('express-async-handler');
const User = require('../models/User.js');
const generateToken = require('../utils/generateToken.js');
const bycrypt = require('bcryptjs');

/* ── helpers ─────────────────────────────────────────────────────── */
const sendAuth = (res, statusCode, user) => {
  const token = generateToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id:         user._id,
      name:        user.name,
      email:       user.email,
      preferences: user.preferences,
      createdAt:   user.createdAt,
    },
  });
};

/* ── POST /api/auth/register ─────────────────────────────────────── */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email and password');
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('Email is already registered');
  }

  const user = await User.create({ name, email, password });
  sendAuth(res, 201, user);
});

/* ── POST /api/auth/login ────────────────────────────────────────── */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  sendAuth(res, 200, user);
});

/* ── GET /api/auth/me ────────────────────────────────────────────── */
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

/* ── PUT /api/auth/profile ───────────────────────────────────────── */
const updateProfile = asyncHandler(async (req, res) => {
  const { name, preferences } = req.body;
  const user = await User.findById(req.user._id);

  if (name)        user.name        = name;
  if (preferences) user.preferences = { ...user.preferences.toObject(), ...preferences };

  await user.save();
  res.json({ success: true, user });
});

/* ── PUT /api/auth/password ──────────────────────────────────────── */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Please provide current and new password');
  }

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(currentPassword))) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error('New password must be at least 6 characters');
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password updated successfully' });
});

module.exports = { register, login, getMe, updateProfile, changePassword };