const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes'); // Separate routes file for better organization
const trackRoutes = require('./routes/trackRoutes')
require('dotenv').config(); // For environment variables

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/track-daily-activity',trackRoutes);

// Server Port
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


