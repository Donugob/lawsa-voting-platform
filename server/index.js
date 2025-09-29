// server/index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// --- IMPORT YOUR NEW ROUTE FILE ---
const authRoutes = require('./routes/authRoutes');
const electionRoutes = require('./routes/electionRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Allow requests only from our specific frontend origins
const allowedOrigins = ['http://localhost:5173', process.env.FRONTEND_URL];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Basic Test Route (you can keep or remove this)
app.get('/api', (req, res) => {
  res.json({ message: "Hello from the LAWSA Voting Platform API!" });
});

// --- TELL THE APP TO USE THE AUTH ROUTES ---
// Any request starting with /api/auth will be handled by authRoutes
app.use('/api/auth', authRoutes);
app.use('/api/election', electionRoutes);
app.use('/api/admin', adminRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});