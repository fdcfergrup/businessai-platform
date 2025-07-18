const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

console.log('🚀 Starting BusinessAI Server...');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/content', require('./routes/content'));
app.use('/api/video', require('./routes/video'));
app.use('/api/scheduler', require('./routes/scheduler'));
app.use('/api/seo', require('./routes/seo'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/business-ai', require('./routes/businessAI'));
app.use('/api/social-platforms', require('./routes/socialPlatforms'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve React app in production
const clientBuildPath = path.join(__dirname, '../client/build');
if (process.env.NODE_ENV === 'production' || process.env.SERVE_STATIC === 'true') {
  app.use(express.static(clientBuildPath));
  
  // Handle React Router - send all non-API requests to React app
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    }
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Có lỗi xảy ra trên server!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Không tìm thấy endpoint' });
});

// Demo mode - no database required
console.log('⚠️  Chạy ở chế độ DEMO không cần MongoDB');
console.log('💡 Tất cả dữ liệu được lưu trong memory');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy trên port ${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`🌐 Production URL: https://your-app-name.azurewebsites.net`);
  } else {
    console.log(`📱 Frontend: http://localhost:3000`);
    console.log(`🔧 Backend: http://localhost:${PORT}`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});