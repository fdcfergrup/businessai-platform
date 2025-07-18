const express = require('express');
const auth = require('../middleware/auth');
const BusinessAIService = require('../services/BusinessAIService');

const router = express.Router();

// Chat with AI
router.post('/chat', auth, async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Tin nhắn là bắt buộc' });
    }

    const response = await BusinessAIService.generateChatResponse({
      message,
      conversationHistory: conversationHistory || []
    });

    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Không thể xử lý tin nhắn' });
  }
});

// Get chat suggestions
router.get('/suggestions', auth, async (req, res) => {
  try {
    const suggestions = [
      'Tạo ý tưởng nội dung cho mạng xã hội',
      'Viết caption cho bài đăng Instagram',
      'Gợi ý chiến lược marketing',
      'Tạo tiêu đề blog hấp dẫn',
      'Phân tích xu hướng thị trường',
      'Tối ưu hóa nội dung SEO',
      'Viết email marketing',
      'Tạo slogan cho thương hiệu'
    ];

    res.json({ suggestions });
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({ message: 'Không thể tải gợi ý' });
  }
});

module.exports = router;