// Mock data service - thay thế MongoDB cho demo
class MockDataService {
  constructor() {
    this.users = [
      {
        _id: '1',
        name: 'Demo User',
        email: 'demo@businessai.com',
        password: '$2a$10$demo.hash.password', // demo password: "123456"
        plan: 'free',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.contents = [
      {
        _id: '1',
        title: 'Hướng dẫn Marketing Digital 2024',
        content: 'Marketing digital đang trở thành xu hướng chủ đạo...',
        type: 'blog',
        keywords: 'marketing, digital, 2024',
        tone: 'professional',
        length: 'medium',
        userId: '1',
        status: 'published',
        views: 1250,
        likes: 45,
        shares: 12,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        _id: '2',
        title: 'Tips SEO hiệu quả',
        content: 'SEO là chìa khóa để website của bạn xuất hiện trên Google...',
        type: 'blog',
        keywords: 'seo, google, website',
        tone: 'casual',
        length: 'short',
        userId: '1',
        status: 'published',
        views: 890,
        likes: 32,
        shares: 8,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      }
    ];

    this.scheduledPosts = [
      {
        _id: '1',
        content: 'Chúc mừng năm mới! 🎉 Cùng BusinessAI khám phá những cơ hội mới trong năm 2024!',
        platform: 'facebook',
        scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: 'scheduled',
        userId: '1',
        mediaUrls: [],
        engagement: {
          likes: 0,
          comments: 0,
          shares: 0,
          views: 0
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: '2',
        content: 'Tips marketing hiệu quả cho doanh nghiệp nhỏ 💡 #marketing #business',
        platform: 'instagram',
        scheduledTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: 'scheduled',
        userId: '1',
        mediaUrls: [],
        engagement: {
          likes: 0,
          comments: 0,
          shares: 0,
          views: 0
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.nextId = 3;
  }

  // User methods
  async findUserByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  async findUserById(id) {
    return this.users.find(user => user._id === id);
  }

  async createUser(userData) {
    const newUser = {
      _id: this.nextId.toString(),
      ...userData,
      plan: 'free',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(newUser);
    this.nextId++;
    return newUser;
  }

  // Content methods
  async findContentByUserId(userId, options = {}) {
    let userContents = this.contents.filter(content => content.userId === userId);
    
    if (options.type) {
      userContents = userContents.filter(content => content.type === options.type);
    }

    // Sort by creation date (newest first)
    userContents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return {
      contents: userContents,
      totalPages: 1,
      currentPage: 1
    };
  }

  async createContent(contentData) {
    const newContent = {
      _id: this.nextId.toString(),
      ...contentData,
      views: 0,
      likes: 0,
      shares: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.contents.push(newContent);
    this.nextId++;
    return newContent;
  }

  async findContentById(id, userId) {
    return this.contents.find(content => content._id === id && content.userId === userId);
  }

  async updateContent(id, userId, updateData) {
    const contentIndex = this.contents.findIndex(content => content._id === id && content.userId === userId);
    if (contentIndex !== -1) {
      this.contents[contentIndex] = {
        ...this.contents[contentIndex],
        ...updateData,
        updatedAt: new Date()
      };
      return this.contents[contentIndex];
    }
    return null;
  }

  async deleteContent(id, userId) {
    const contentIndex = this.contents.findIndex(content => content._id === id && content.userId === userId);
    if (contentIndex !== -1) {
      return this.contents.splice(contentIndex, 1)[0];
    }
    return null;
  }

  // Scheduled Posts methods
  async findScheduledPostsByUserId(userId, options = {}) {
    let userPosts = this.scheduledPosts.filter(post => post.userId === userId);
    
    if (options.status) {
      userPosts = userPosts.filter(post => post.status === options.status);
    }
    
    if (options.platform) {
      userPosts = userPosts.filter(post => post.platform === options.platform);
    }

    // Sort by scheduled time
    userPosts.sort((a, b) => new Date(b.scheduledTime) - new Date(a.scheduledTime));

    return {
      posts: userPosts,
      totalPages: 1,
      currentPage: 1
    };
  }

  async createScheduledPost(postData) {
    const newPost = {
      _id: this.nextId.toString(),
      ...postData,
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.scheduledPosts.push(newPost);
    this.nextId++;
    return newPost;
  }

  async findScheduledPostById(id, userId) {
    return this.scheduledPosts.find(post => post._id === id && post.userId === userId);
  }

  async updateScheduledPost(id, userId, updateData) {
    const postIndex = this.scheduledPosts.findIndex(post => post._id === id && post.userId === userId);
    if (postIndex !== -1) {
      this.scheduledPosts[postIndex] = {
        ...this.scheduledPosts[postIndex],
        ...updateData,
        updatedAt: new Date()
      };
      return this.scheduledPosts[postIndex];
    }
    return null;
  }

  async deleteScheduledPost(id, userId) {
    const postIndex = this.scheduledPosts.findIndex(post => post._id === id && post.userId === userId);
    if (postIndex !== -1) {
      return this.scheduledPosts.splice(postIndex, 1)[0];
    }
    return null;
  }

  // Analytics methods
  async getDashboardStats(userId) {
    const userContents = this.contents.filter(content => content.userId === userId);
    const userPosts = this.scheduledPosts.filter(post => post.userId === userId);
    
    return {
      totalContent: userContents.length,
      totalVideos: 0, // Mock data
      scheduledPosts: userPosts.filter(post => post.status === 'scheduled').length,
      totalViews: userContents.reduce((sum, content) => sum + content.views, 0) +
                  userPosts.reduce((sum, post) => sum + post.engagement.views, 0)
    };
  }

  async getAnalyticsOverview(userId, startDate) {
    const userContents = this.contents.filter(content => 
      content.userId === userId && new Date(content.createdAt) >= startDate
    );
    const userPosts = this.scheduledPosts.filter(post => 
      post.userId === userId && new Date(post.createdAt) >= startDate
    );

    const totalViews = userContents.reduce((sum, content) => sum + content.views, 0) +
                      userPosts.reduce((sum, post) => sum + post.engagement.views, 0);
    const totalLikes = userContents.reduce((sum, content) => sum + content.likes, 0) +
                      userPosts.reduce((sum, post) => sum + post.engagement.likes, 0);
    const totalShares = userContents.reduce((sum, content) => sum + content.shares, 0) +
                       userPosts.reduce((sum, post) => sum + post.engagement.shares, 0);
    const totalComments = userPosts.reduce((sum, post) => sum + post.engagement.comments, 0);

    // Mock platform stats
    const platformStats = [
      { name: 'Facebook', views: 1200, engagementRate: 3.5 },
      { name: 'Instagram', views: 890, engagementRate: 4.2 },
      { name: 'Twitter', views: 650, engagementRate: 2.8 }
    ];

    return {
      totalViews,
      totalLikes,
      totalShares,
      totalEngagement: totalComments + totalLikes + totalShares,
      viewsChange: Math.floor(Math.random() * 20) - 10,
      likesChange: Math.floor(Math.random() * 20) - 10,
      sharesChange: Math.floor(Math.random() * 20) - 10,
      engagementChange: Math.floor(Math.random() * 20) - 10,
      platformStats
    };
  }

  async getTopContent(userId, startDate) {
    return this.contents
      .filter(content => content.userId === userId && new Date(content.createdAt) >= startDate)
      .sort((a, b) => (b.views + b.likes + b.shares) - (a.views + a.likes + a.shares))
      .slice(0, 10);
  }

  // Count methods
  async countContentByUserId(userId, filter = {}) {
    let userContents = this.contents.filter(content => content.userId === userId);
    if (filter.type) {
      userContents = userContents.filter(content => content.type === filter.type);
    }
    return userContents.length;
  }

  async countScheduledPostsByUserId(userId, filter = {}) {
    let userPosts = this.scheduledPosts.filter(post => post.userId === userId);
    if (filter.status) {
      userPosts = userPosts.filter(post => post.status === filter.status);
    }
    if (filter.platform) {
      userPosts = userPosts.filter(post => post.platform === filter.platform);
    }
    return userPosts.length;
  }
}

// Singleton instance
const mockDataService = new MockDataService();
module.exports = mockDataService;