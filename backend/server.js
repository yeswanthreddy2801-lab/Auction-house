import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import errorHandler from './middleware/error.js';

// Route files
import authRoutes from './routes/authRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import productRoutes from './routes/productRoutes.js';
import { finalizeExpiredAuctions } from './controllers/productController.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

//it is similar to load balancer
// Trust proxy when running behind a load balancer / reverse proxy (Render, Vercel, etc.)
// This allows express-rate-limit to correctly read the real client IP from X-Forwarded-For
app.set('trust proxy', 1);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security headers
app.use(helmet({
    crossOriginResourcePolicy: false, // Allow loading images from local server
}));

// CORS
app.use(cors());

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
});
app.use('/api', limiter);

// Set static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    await finalizeExpiredAuctions();
    setInterval(finalizeExpiredAuctions, 60 * 1000);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
