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

// Shipping address, embedded within an order document
const addressSchema = new mongoose.Schema(
  {
    line1: { type: String },
    line2: { type: String },
    city: { type: String },
    region: { type: String },
    postalCode: { type: String },
    country: { type: String },
  },
  { _id: false }
);

// A single status transition, appended to build the order's timeline
const statusEventSchema = new mongoose.Schema(
  {
    status: { type: String, required: true, enum: ['pending', 'completed', 'shipped', 'delivered', 'cancelled'] },
    note: { type: String },
    at: { type: Date, default: Date.now },
    changedBy: { type: String }, // admin username, or "system" for automated transitions
  },
  { _id: false }
);

// Customer order, stored in the "maison" database
const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    customerName: { type: String },
    distinctId: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    items: { type: [orderItemSchema], default: [] },
    subtotal: { type: Number, required: true },
    collection: { type: String },
    status: {
      type: String,
      enum: ['pending', 'completed', 'shipped', 'delivered', 'cancelled'],
      default: 'completed',
    },
    shippingAddress: { type: addressSchema },
    statusHistory: { type: [statusEventSchema], default: [] },
  },
  { collection: 'orders', timestamps: true, suppressReservedKeysWarning: true }
);

export default mongoose.model('Order', orderSchema);
