import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';

// Load environment variables (iz .env)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = express();

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? [
            'https://blog.100jsprojects.com',
            'https://mern-blog-client-steel.vercel.app',
            /\.vercel\.app$/,
          ]
        : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// MongoDB connection
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.log('❌ MongoDB connection error:', err.message);
    throw err;
  }
};

// Middleware to connect DB before routes
const connectMiddleware = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
};

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!', timestamp: new Date() });
});

// Debug endpoints
app.get('/api/debug', (req, res) => {
  res.json({
    message: 'Debug info',
    nodeEnv: process.env.NODE_ENV,
    hasMongoEnv: !!process.env.MONGO,
    hasJwtSecret: !!process.env.JWT_SECRET,
    timestamp: new Date(),
  });
});

app.get('/api/debug-db', async (req, res) => {
  try {
    await connectDB();
    res.json({ message: 'Database connection successful!', connected: true, timestamp: new Date() });
  } catch (error) {
    res.json({ message: 'Database connection failed', connected: false, error: error.message, timestamp: new Date() });
  }
});

// Routes
app.use('/api/user', connectMiddleware, userRoutes);
app.use('/api/auth', connectMiddleware, authRoutes);
app.use('/api/post', connectMiddleware, postRoutes);
app.use('/api/comment', connectMiddleware, commentRoutes);

// Error handling
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ success: false, message, statusCode });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`✅ Server running on port ${PORT} and connected to MongoDB`);
  } catch (err) {
    console.log('⚠️ Server running but failed to connect to MongoDB:', err.message);
  }
});
