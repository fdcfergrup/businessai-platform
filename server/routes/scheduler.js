const express = require('express');
const mockDataService = require('../services/MockDataService');
const auth = require('../middleware/auth');

const router = express.Router();

// Get scheduled posts
router.get('/posts', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, platform } = req.query;
    const options = {};
    
    if (status) options.status = status;
    if (platform) options.platform = platform;

    const result = await mockDataService.findScheduledPostsByUserId(req.userId, options);
    res.json(result);
  } catch (error) {
    console.error('Get scheduled posts error:', error);
    res.status(500).json({ message: 'Không thể tải danh sách bài đăng' });
  }
});

// Create scheduled post
router.post('/posts', auth, async (req, res) => {
  try {
    const { content, platform, scheduledTime, mediaUrls } = req.body;

    if (!content || !platform || !scheduledTime) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    const scheduledPost = await mockDataService.createScheduledPost({
      content,
      platform,
      scheduledTime: new Date(scheduledTime),
      mediaUrls: mediaUrls || [],
      userId: req.userId,
      status: 'scheduled'
    });

    res.status(201).json(scheduledPost);
  } catch (error) {
    console.error('Create scheduled post error:', error);
    res.status(500).json({ message: 'Không thể tạo lịch đăng' });
  }
});

// Update scheduled post
router.put('/posts/:id', auth, async (req, res) => {
  try {
    const { content, platform, scheduledTime, status, mediaUrls } = req.body;

    const updatedPost = await mockDataService.updateScheduledPost(
      req.params.id,
      req.userId,
      { content, platform, scheduledTime: new Date(scheduledTime), status, mediaUrls }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Không tìm thấy bài đăng' });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error('Update scheduled post error:', error);
    res.status(500).json({ message: 'Không thể cập nhật bài đăng' });
  }
});

// Delete scheduled post
router.delete('/posts/:id', auth, async (req, res) => {
  try {
    const deletedPost = await mockDataService.deleteScheduledPost(req.params.id, req.userId);

    if (!deletedPost) {
      return res.status(404).json({ message: 'Không tìm thấy bài đăng' });
    }

    res.json({ message: 'Đã xóa bài đăng thành công' });
  } catch (error) {
    console.error('Delete scheduled post error:', error);
    res.status(500).json({ message: 'Không thể xóa bài đăng' });
  }
});

// Get post by ID
router.get('/posts/:id', auth, async (req, res) => {
  try {
    const post = await mockDataService.findScheduledPostById(req.params.id, req.userId);

    if (!post) {
      return res.status(404).json({ message: 'Không tìm thấy bài đăng' });
    }

    res.json(post);
  } catch (error) {
    console.error('Get post by ID error:', error);
    res.status(500).json({ message: 'Không thể tải bài đăng' });
  }
});

module.exports = router;