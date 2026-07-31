import mongoose from '../lib/db.js';

// Journal article, stored in the "maison" database
const articleSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true },
    category: { type: String },
    date: { type: Date, default: Date.now },
    image: { type: String },
    excerpt: { type: String },
    body: { type: [String], default: [] },
  },
  { collection: 'articles', timestamps: true }
);

export default mongoose.model('Article', articleSchema);
