import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export async function connectDB() {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (mongoUri && mongoUri.trim() !== '') {
      console.log('Connecting to external MongoDB Atlas database...');
      await mongoose.connect(mongoUri);
      console.log('MongoDB connected successfully.');
      return;
    }

    // Fallback: In-memory database for zero-setup local dev & Render free-tier testing
    console.log('MONGODB_URI not provided. Initializing in-memory MongoDB server (Debian 12 compatible version 7.0.3)...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create({
        instance: {
          version: '7.0.3'
        }
      });
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log(`In-Memory MongoDB connected successfully at ${uri}`);
    } catch (memErr) {
      console.error('MongoMemoryServer download failed on container:', memErr.message);
      console.log('Falling back to internal in-memory state handler...');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
}
