const express = require('express');
const auth = require('../middleware/auth');
const BusinessAIService = require('../services/BusinessAIService');

const router = express.Router();

// Generate business content
router.post('/generate-content', auth, async (req, res) => {
  try {
    const { topic, contentType, tone, length, keywords } = req.body;

    if (!topic) {
      return res.status(400).json({ message: 'Chủ đề là bắt buộc' });
    }

    const content = await BusinessAIService.generateContent({
      topic,
      contentType,
      tone,
      length,
      keywords
    });

    res.json({ content });
  } catch (error) {
    console.error('Business AI content generation error:', error);
    res.status(500).json({ message: 'Không thể tạo nội dung' });
  }
});

// Generate business ideas
router.post('/generate-ideas', auth, async (req, res) => {
  try {
    const { industry, target, budget } = req.body;

    // Mock business ideas generation
    const ideas = [
      `Phát triển ứng dụng mobile cho ngành ${industry || 'công nghệ'}`,
      `Tạo nội dung marketing cho ${target || 'khách hàng trẻ'}`,
      `Chiến lược SEO với ngân sách ${budget || 'hạn chế'}`,
      `Xây dựng thương hiệu cá nhân trên mạng xã hội`,
      `Tối ưu hóa quy trình bán hàng online`
    ];

    res.json({ ideas });
  } catch (error) {
    console.error('Business ideas generation error:', error);
    res.status(500).json({ message: 'Không thể tạo ý tưởng kinh doanh' });
  }
});

module.exports = router;