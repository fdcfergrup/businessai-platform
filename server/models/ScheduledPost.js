const mongoose = require('mongoose');

const scheduledPostSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    enum: ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok'],
    required: true
  },
  scheduledTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'published', 'failed', 'cancelled'],
    default: 'scheduled'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mediaUrls: [{
    type: String
  }],
  publishedAt: {
    type: Date
  },
  errorMessage: {
    type: String
  },
  engagement: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    views: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ScheduledPost', scheduledPostSchema);