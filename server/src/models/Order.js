import mongoose from '../lib/db.js';

// Order line item, embedded within an order document
const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    variantId: { type: String },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
  },
  { _id: false }
);

// Customer order, stored in the "maison" database
const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    distinctId: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    items: { type: [orderItemSchema], default: [] },
    subtotal: { type: Number, required: true },
    collection: { type: String },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'completed' },
  },
  { collection: 'orders', timestamps: true, suppressReservedKeysWarning: true }
);

export default mongoose.model('Order', orderSchema);
