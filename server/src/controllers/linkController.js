import { nanoid } from 'nanoid';
import validator from 'validator';
import Link from '../models/Link.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const codeLength = Math.max(5, Math.min(10, Number(process.env.SHORT_CODE_LENGTH) || 6));
const baseUrl = () => (process.env.API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
const serialize = (link) => ({
  id: link._id, originalUrl: link.originalUrl, shortCode: link.shortCode,
  shortUrl: `${baseUrl()}/${link.shortCode}`, title: link.title,
  clicks: link.clicks, createdAt: link.createdAt, expiresAt: link.expiresAt,
  isActive: link.isActive
});
function normalizeUrl(input) {
  let value = String(input || '').trim();
  if (!value) return null;
  if (!/^https?:\/\//i.test(value)) value = `https://${value}`;
  if (!validator.isURL(value, { protocols: ['http', 'https'], require_protocol: true, require_valid_protocol: true, allow_underscores: true })) return null;
  try {
    const parsed = new URL(value);
    if (['localhost', '127.0.0.1', '0.0.0.0'].includes(parsed.hostname)) return null;
    return parsed.toString();
  } catch { return null; }
}
export const createLink = asyncHandler(async (req, res) => {
  const originalUrl = normalizeUrl(req.body.url);
  if (!originalUrl) return res.status(400).json({ message: 'Enter a valid public URL, like https://example.com.' });
  const custom = String(req.body.customCode || '').trim();
  if (custom && !/^[a-zA-Z0-9_-]{3,24}$/.test(custom)) {
    return res.status(400).json({ message: 'Custom alias must be 3–24 characters (letters, numbers, _ or -).' });
  }
  const reserved = ['api', 'health', 'login', 'register', 'analytics', 'links'];
  if (custom && reserved.includes(custom.toLowerCase())) return res.status(400).json({ message: 'That alias is reserved. Try another one.' });
  const shortCode = custom || nanoid(codeLength);
  if (await Link.exists({ shortCode })) return res.status(409).json({ message: 'That short link is already taken.' });
  let expiresAt = null;
  if (req.body.expiresAt) {
    expiresAt = new Date(req.body.expiresAt);
    if (Number.isNaN(expiresAt.getTime()) || expiresAt <= new Date()) return res.status(400).json({ message: 'Expiry must be a valid future date.' });
  }
  const link = await Link.create({ originalUrl, shortCode, title: String(req.body.title || '').slice(0, 100), user: req.user?._id || null, expiresAt });
  res.status(201).json({ link: serialize(link) });
});
export const listLinks = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const search = String(req.query.search || '').trim().slice(0, 100);
  const query = { user: req.user._id };
  if (search) query.$or = [{ originalUrl: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } }, { shortCode: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } }];
  const [links, total] = await Promise.all([Link.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit), Link.countDocuments(query)]);
  res.json({ links: links.map(serialize), page, pages: Math.ceil(total / limit), total });
});
export const getAnalytics = asyncHandler(async (req, res) => {
  const links = await Link.find({ user: req.user._id }).sort({ createdAt: -1 });
  const allEvents = links.flatMap(link => link.clickEvents.map(event => ({ ...event.toObject(), code: link.shortCode, originalUrl: link.originalUrl })));
  const daily = {};
  for (const event of allEvents) {
    const day = new Date(event.clickedAt).toISOString().slice(0, 10);
    daily[day] = (daily[day] || 0) + 1;
  }
  res.json({ totalLinks: links.length, totalClicks: links.reduce((sum, link) => sum + link.clicks, 0), topLinks: links.slice().sort((a,b) => b.clicks-a.clicks).slice(0, 5).map(serialize), daily: Object.entries(daily).sort(([a],[b]) => a.localeCompare(b)).slice(-14).map(([date, clicks]) => ({ date, clicks })), recentClicks: allEvents.sort((a,b) => new Date(b.clickedAt)-new Date(a.clickedAt)).slice(0, 20) });
});
export const deleteLink = asyncHandler(async (req, res) => {
  const link = await Link.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!link) return res.status(404).json({ message: 'Link not found.' });
  res.json({ message: 'Link deleted.' });
});
export const toggleLink = asyncHandler(async (req, res) => {
  const link = await Link.findOne({ _id: req.params.id, user: req.user._id });
  if (!link) return res.status(404).json({ message: 'Link not found.' });
  link.isActive = !link.isActive;
  await link.save();
  res.json({ link: serialize(link) });
});
export const redirectLink = asyncHandler(async (req, res) => {
  const link = await Link.findOne({ shortCode: req.params.code });
  if (!link || !link.isActive || (link.expiresAt && link.expiresAt <= new Date())) return res.status(404).send('This short link is unavailable or has expired.');
  const referrer = req.get('referer') || 'Direct';
  link.clicks += 1;
  link.clickEvents.push({ clickedAt: new Date(), referrer: referrer.slice(0, 500), userAgent: (req.get('user-agent') || '').slice(0, 500) });
  if (link.clickEvents.length > 5000) link.clickEvents = link.clickEvents.slice(-5000);
  await link.save();
  res.redirect(302, link.originalUrl);
});
