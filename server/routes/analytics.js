const express = require('express');
const mockDataService = require('../services/MockDataService');
const auth = require('../middleware/auth');

const router = express.Router();

// Get dashboard overview
router.get('/dashboard', auth, async (req, res) => {
  try {
    const stats = await mockDataService.getDashboardStats(req.userId);
    res.json(stats);
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({ message: 'Không thể tải dữ liệu dashboard' });
  }
});

// Get analytics overview
router.get('/overview', auth, async (req, res) => {
  try {
    const { range = '7d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (range) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const analytics = await mockDataService.getAnalyticsOverview(req.userId, startDate);
    res.json(analytics);
  } catch (error) {
    console.error('Analytics overview error:', error);
    res.status(500).json({ message: 'Không thể tải dữ liệu phân tích' });
  }
});

// Get content performance
router.get('/content-performance', auth, async (req, res) => {
  try {
    const { range = '7d' } = req.query;
    
    const now = new Date();
    let startDate;
    
    switch (range) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const topContent = await mockDataService.getTopContent(req.userId, startDate);
    res.json(topContent);
  } catch (error) {
    console.error('Content performance error:', error);
    res.status(500).json({ message: 'Không thể tải dữ liệu hiệu suất nội dung' });
  }
});

module.exports = router;