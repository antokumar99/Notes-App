const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db.js');
const authRoutes = require('./routes/authRoutes.js');
const notesRoutes = require('./routes/noteRoutes.js');
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js');


/* ── connect ─────────────────────────────────────────────────────── */
connectDB();

/* ── app ─────────────────────────────────────────────────────────── */
const app = express();

/* ── global middleware ───────────────────────────────────────────── */
app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Throttle auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max:      20,
  message:  { success: false, message: 'Too many requests, please try again later' },
});

/* ── routes ──────────────────────────────────────────────────────── */
app.use('/api/auth',  authLimiter, authRoutes);
app.use('/api/notes', notesRoutes);

app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', env: process.env.NODE_ENV, ts: new Date() })
);

/* ── error handling ──────────────────────────────────────────────── */
app.use(notFound);
app.use(errorHandler);

/* ── listen ──────────────────────────────────────────────────────── */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀  API listening on port ${PORT}`));