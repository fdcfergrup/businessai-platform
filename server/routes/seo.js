const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Keyword analysis
router.post('/keyword-analysis', auth, async (req, res) => {
  try {
    const { keyword } = req.body;

    if (!keyword) {
      return res.status(400).json({ message: 'Từ khóa là bắt buộc' });
    }

    // Mock keyword analysis data
    // In production, integrate with real SEO APIs like SEMrush, Ahrefs, etc.
    const mockData = {
      searchVolume: Math.floor(Math.random() * 10000) + 1000,
      difficulty: Math.floor(Math.random() * 100),
      cpc: (Math.random() * 5).toFixed(2),
      relatedKeywords: [
        `${keyword} 2024`,
        `${keyword} hướng dẫn`,
        `${keyword} miễn phí`,
        `${keyword} tốt nhất`,
        `cách ${keyword}`,
        `${keyword} online`
      ]
    };

    res.json(mockData);
  } catch (error) {
    console.error('Keyword analysis error:', error);
    res.status(500).json({ message: 'Không thể phân tích từ khóa' });
  }
});

// Content analysis
router.post('/content-analysis', auth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Nội dung là bắt buộc' });
    }

    // Basic content analysis
    const wordCount = content.split(/\s+/).length;
    const sentences = content.split(/[.!?]+/).length - 1;
    const avgWordsPerSentence = sentences > 0 ? Math.round(wordCount / sentences) : 0;
    
    // Mock SEO score calculation
    let seoScore = 50;
    let readabilityScore = 60;
    const suggestions = [];

    // Basic SEO checks
    if (wordCount < 300) {
      suggestions.push('Nội dung quá ngắn. Nên có ít nhất 300 từ để SEO tốt hơn.');
      seoScore -= 10;
    }

    if (wordCount > 2000) {
      suggestions.push('Nội dung khá dài. Cân nhắc chia thành nhiều phần nhỏ hơn.');
    }

    if (avgWordsPerSentence > 20) {
      suggestions.push('Câu văn quá dài. Nên rút ngắn để dễ đọc hơn.');
      readabilityScore -= 15;
    }

    if (!content.includes('?')) {
      suggestions.push('Thêm câu hỏi để tăng tương tác với người đọc.');
      seoScore += 5;
    }

    // Check for headings (basic check for markdown or HTML)
    if (!content.includes('#') && !content.includes('<h')) {
      suggestions.push('Thêm tiêu đề phụ (H2, H3) để cấu trúc nội dung tốt hơn.');
      seoScore -= 15;
    }

    // Adjust scores
    seoScore = Math.max(0, Math.min(100, seoScore + Math.floor(Math.random() * 30)));
    readabilityScore = Math.max(0, Math.min(100, readabilityScore + Math.floor(Math.random() * 25)));

    if (suggestions.length === 0) {
      suggestions.push('Nội dung của bạn đã khá tốt! Tiếp tục duy trì chất lượng.');
    }

    res.json({
      seoScore,
      readabilityScore,
      wordCount,
      sentences,
      avgWordsPerSentence,
      suggestions
    });
  } catch (error) {
    console.error('Content analysis error:', error);
    res.status(500).json({ message: 'Không thể phân tích nội dung' });
  }
});

module.exports = router;