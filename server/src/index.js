import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import linkRoutes from './routes/linkRoutes.js';
import { redirectLink } from './controllers/linkController.js';
import { asyncHandler } from './utils/asyncHandler.js';

const app = express();
app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: (process.env.CLIENT_URL || 'http://localhost:5173','https://linkvault-tau-eight.vercel.app').split(',').map(s => s.trim()), credentials: false }));
app.use(express.json({ limit: '20kb' }));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-7', legacyHeaders: false }));
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'LinkVault API' }));
app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);
app.get('/:code', (req, res, next) => {
  if (['favicon.ico', 'robots.txt'].includes(req.params.code)) return res.status(404).end();
  return redirectLink(req, res, next);
});
app.use((req, res) => res.status(404).json({ message: 'Route not found.' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.code === 11000) return res.status(409).json({ message: 'That value already exists.' });
  res.status(err.status || 500).json({ message: process.env.NODE_ENV === 'production' ? 'Something went wrong.' : (err.message || 'Server error.') });
});
const port = process.env.PORT || 5000;
connectDB().then(() => app.listen(port, () => console.log(`LinkVault API running on http://localhost:${port}`))).catch(err => { console.error('Database connection failed:', err.message); process.exit(1); });
