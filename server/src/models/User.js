import mongoose from '../lib/db.js';

// Registered customer account, stored in the "maison" database
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, trim: true },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    wishlist: { type: [String], default: [] }, // product ids
  },
  { collection: 'users', timestamps: true }
);

export default mongoose.model('User', userSchema);
