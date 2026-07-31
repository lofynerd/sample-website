import mongoose from '../lib/db.js';

// Newsletter subscriber, stored in the "maison" database
const subscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    subscribedAt: { type: Date, default: Date.now },
  },
  { collection: 'subscribers' }
);

export default mongoose.model('Subscriber', subscriberSchema);
