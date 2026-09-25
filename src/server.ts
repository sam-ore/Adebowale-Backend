import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import carRoutes from './routes/cars.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      'https://adebowale-motors.vercel.app',
      'https://adebowale-motors-bsnvlknz4-sam-ores-projects.vercel.app',
      'http://localhost:5173',
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/cars', carRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Adebowale Motors API is running',
    timestamp: new Date().toISOString(),
  });
});

// Error handler
app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    console.error('Error:', err.message);
    res.status(500).json({ error: err.message || 'Something went wrong!' });
  }
);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in .env');
    }

    await mongoose.connect(mongoUri);
    console.log(' Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
      console.log(` API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error(' Failed to start server:', error);
    process.exit(1);
  }
};

startServer();