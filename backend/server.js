require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const connectDB = require('./config/db');

const adminRoutes  = require('./routes/adminRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const userRoutes   = require('./routes/userRoutes');

const app = express();
// Serve frontend folder
app.use(express.static(path.join(__dirname, "../frontend")));

connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'eventmgmtsecret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));
app.use(flash());

// Make flash messages & session user available to all responses
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg   = req.flash('error_msg');
  res.locals.user        = req.session.user || null;
  next();
});

// Routes
app.use('/api/admin',  adminRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/user',   userRoutes);

// Serve index page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/index.html"));
});

