const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Load Supabase connection on startup
require('./supabase');

const authRoutes = require('./routes/authRoutes');
const penggunaRoutes = require('./routes/penggunaRoutes');
const kendaraanRoutes = require('./routes/kendaraanRoutes');
const parkirRoutes = require('./routes/parkirRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/pengguna', '/pengguna'], penggunaRoutes);
app.use(['/api/kendaraan', '/kendaraan'], kendaraanRoutes);
app.use(['/api/parkir', '/parkir'], parkirRoutes);

// Root endpoint
app.get(['/', '/api'], (req, res) => {
  res.json({
    message: '🚗 Sistem Informasi Parkir - Politeknik Negeri Lampung',
    version: '1.0.0',
    status: 'running',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  });
}

module.exports = app;
