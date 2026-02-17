require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash   = require('connect-flash');
const path    = require('path');
const fs      = require('fs');
const connectDB = require('./config/db');

const adminRoutes  = require('./routes/adminRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const userRoutes   = require('./routes/userRoutes');

const app = express();
connectDB();

const ROOT     = path.join(__dirname, '..');
const FRONTEND = path.join(ROOT, 'frontend');
const PAGES    = path.join(FRONTEND, 'pages');
const UPLOADS  = path.join(ROOT, 'uploads');

if (!fs.existsSync(UPLOADS)) fs.mkdirSync(UPLOADS, { recursive: true });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(FRONTEND));
app.use('/uploads', express.static(UPLOADS));

app.use(session({
  secret: process.env.SESSION_SECRET || 'eventmgmtsecret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg   = req.flash('error_msg');
  res.locals.user        = req.session.user || null;
  next();
});

app.use('/api/admin',  adminRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/user',   userRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(PAGES, 'index.html'));
});

app.get('/pages/:page', (req, res) => {
  const filePath = path.join(PAGES, req.params.page);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Page not found');
  }
});

app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'Route not found' });
  }
  res.sendFile(path.join(PAGES, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
