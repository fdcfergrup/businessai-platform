const express = require('express');
const mockDataService = require('../services/MockDataService');
const auth = require('../middleware/auth');
const BusinessAIService = require('../services/BusinessAIService');

const router = express.Router();

// Generate content
router.post('/generate', auth, async (req, res) => {
  try {
    const { topic, contentType, tone, length, keywords } = req.body;

    if (!topic) {
      return res.status(400).json({ message: 'Chủ đề là bắt buộc' });
    }

    const generatedContent = await BusinessAIService.generateContent({
      topic,
      contentType,
      tone,
      length,
      keywords
    });

    res.json({ content: generatedContent });
  } catch (error) {
    console.error('Content generation error:', error);
    res.status(500).json({ message: 'Không thể tạo nội dung' });
  }
});

// Save content
router.post('/save', auth, async (req, res) => {
  try {
    const { title, content, type, keywords } = req.body;

    const newContent = await mockDataService.createContent({
      title,
      content,
      type,
      keywords,
      userId: req.userId
    });

    res.status(201).json(newContent);
  } catch (error) {
    console.error('Save content error:', error);
    res.status(500).json({ message: 'Không thể lưu nội dung' });
  }
});

// Get user's content
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    const options = {};
    
    if (type) {
      options.type = type;
    }

    const result = await mockDataService.findContentByUserId(req.userId, options);
    res.json(result);
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ message: 'Không thể tải nội dung' });
  }
});

// Get content by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const content = await mockDataService.findContentById(req.params.id, req.userId);

    if (!content) {
      return res.status(404).json({ message: 'Không tìm thấy nội dung' });
    }

    res.json(content);
  } catch (error) {
    console.error('Get content by ID error:', error);
    res.status(500).json({ message: 'Không thể tải nội dung' });
  }
});

// Update content
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, type, keywords, status } = req.body;

    const updatedContent = await mockDataService.updateContent(
      req.params.id, 
      req.userId, 
      { title, content, type, keywords, status }
    );

    if (!updatedContent) {
      return res.status(404).json({ message: 'Không tìm thấy nội dung' });
    }

    res.json(updatedContent);
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ message: 'Không thể cập nhật nội dung' });
  }
});

// Delete content
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedContent = await mockDataService.deleteContent(req.params.id, req.userId);

    if (!deletedContent) {
      return res.status(404).json({ message: 'Không tìm thấy nội dung' });
    }

    res.json({ message: 'Đã xóa nội dung thành công' });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ message: 'Không thể xóa nội dung' });
  }
});

module.exports = router;