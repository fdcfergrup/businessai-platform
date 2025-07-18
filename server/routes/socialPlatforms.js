const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Get supported platforms
router.get('/platforms', auth, async (req, res) => {
  try {
    const platforms = [
      {
        id: 'facebook',
        name: 'Facebook',
        icon: 'facebook',
        color: '#1877F2',
        connected: false,
        features: ['posts', 'images', 'videos', 'scheduling']
      },
      {
        id: 'instagram',
        name: 'Instagram',
        icon: 'instagram',
        color: '#E4405F',
        connected: false,
        features: ['posts', 'stories', 'reels', 'scheduling']
      },
      {
        id: 'twitter',
        name: 'Twitter',
        icon: 'twitter',
        color: '#1DA1F2',
        connected: false,
        features: ['tweets', 'threads', 'scheduling']
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: 'linkedin',
        color: '#0A66C2',
        connected: false,
        features: ['posts', 'articles', 'scheduling']
      },
      {
        id: 'tiktok',
        name: 'TikTok',
        icon: 'tiktok',
        color: '#000000',
        connected: false,
        features: ['videos', 'scheduling']
      }
    ];

    res.json({ platforms });
  } catch (error) {
    console.error('Get platforms error:', error);
    res.status(500).json({ message: 'Không thể tải danh sách nền tảng' });
  }
});

// Connect platform
router.post('/connect/:platform', auth, async (req, res) => {
  try {
    const { platform } = req.params;
    const { accessToken } = req.body;

    // Mock platform connection
    // In production, implement OAuth flow for each platform
    
    res.json({ 
      message: `Kết nối ${platform} thành công!`,
      connected: true,
      platform
    });
  } catch (error) {
    console.error('Connect platform error:', error);
    res.status(500).json({ message: 'Không thể kết nối nền tảng' });
  }
});

// Disconnect platform
router.delete('/disconnect/:platform', auth, async (req, res) => {
  try {
    const { platform } = req.params;

    // Mock platform disconnection
    res.json({ 
      message: `Đã ngắt kết nối ${platform}`,
      connected: false,
      platform
    });
  } catch (error) {
    console.error('Disconnect platform error:', error);
    res.status(500).json({ message: 'Không thể ngắt kết nối nền tảng' });
  }
});

module.exports = router;