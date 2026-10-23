import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
  clickedAt: { type: Date, default: Date.now },
  referrer: { type: String, default: 'Direct' },
  userAgent: { type: String, default: '' },
  country: { type: String, default: 'Unknown' }
}, { _id: false });
const linkSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true, maxlength: 4096 },
  shortCode: { type: String, required: true, unique: true, index: true },
  title: { type: String, trim: true, maxlength: 100, default: '' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  clicks: { type: Number, default: 0 },
  clickEvents: { type: [clickSchema], default: [] },
  expiresAt: { type: Date, default: null },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
linkSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, sparse: true });
export default mongoose.model('Link', linkSchema);
