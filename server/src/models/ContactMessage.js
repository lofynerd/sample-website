import mongoose from '../lib/db.js';

// Contact form submission, stored in the "maison" database
const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ['new', 'read', 'resolved'], default: 'new' },
  },
  { collection: 'contact_messages', timestamps: true }
);

export default mongoose.model('ContactMessage', contactMessageSchema);
