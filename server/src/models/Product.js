import mongoose from '../lib/db.js';

// Product colorway, embedded within a product document
const colorSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    swatch: { type: String, required: true },
    image: { type: String, required: true },
  },
  { _id: false }
);

// Product catalog entry, stored in the "maison" database
const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    collection: { type: String, index: true },
    category: { type: String },
    description: { type: String },
    story: { type: String },
    materials: { type: [String], default: [] },
    care: { type: [String], default: [] },
    colors: { type: [colorSchema], default: [] },
    sizes: { type: [String], default: [] },
    images: { type: [String], default: [] },
    image: { type: String },
    hoverImage: { type: String },
  },
  { collection: 'products', timestamps: true, suppressReservedKeysWarning: true }
);

export default mongoose.model('Product', productSchema);
