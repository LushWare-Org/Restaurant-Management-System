const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const tablereservationRoutes = require('./routes/tablereservationRoutes');
const walkinRoutes = require('./routes/walkinRoutes');

const app = express();

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS ? 
  process.env.ALLOWED_ORIGINS.split(',') : 
  ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'pragma', 'cache-control', 'expires', 'x-auth-token'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/table-reservations', tablereservationRoutes);
app.use('/api/walkins', walkinRoutes);

// Legacy route for backward compatibility (the frontend uses this inconsistent URL)
app.use('/api/tablereservationRoutes', tablereservationRoutes);
app.use('/api/tablereservation', tablereservationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME || 'HotelManagementSystem';

if (!mongoUri) {
  console.error('MONGO_URI environment variable is not set');
  process.exit(1);
}

mongoose
  .connect(mongoUri, {
    dbName: dbName,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    minPoolSize: 5,
    maxIdleTimeMS: 30000,
    bufferCommands: false,
  })
  .then(() => {
    console.log(`Connected to MongoDB database: ${dbName}`);
    console.log('Database connection successful');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});