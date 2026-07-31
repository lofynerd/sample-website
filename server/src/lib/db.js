import mongoose from 'mongoose';

// Connects to the "maison" database on the configured MongoDB cluster
export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('MONGODB_URI is not set, database features are disabled');
    return;
  }

  try {
    await mongoose.connect(uri, { dbName: 'maison' });
    console.log('Connected to MongoDB (database: maison)');
  } catch (err) {
    console.error('MongoDB connection error', err);
  }
}

export default mongoose;
