const axios = require('axios');
const config = require('../config/socialPlatforms');

class FacebookService {
  constructor() {
    this.config = config.facebook;
    this.baseUrl = `${this.config.baseUrl}/${this.config.apiVersion}`;
  }

  // Lấy URL OAuth để người dùng authorize
  getAuthUrl(redirectUri, state) {
    const params = new URLSearchParams({
      client_id: this.config.appId,
      redirect_uri: redirectUri,
      scope: this.config.scopes.join(','),
      response_type: 'code',
      state: state
    });

    return `https://www.facebook.com/dialog/oauth?${params.toString()}`;
  }

  // Đổi authorization code thành access token
  async getAccessToken(code, redirectUri) {
    try {
      const response = await axios.get(`${this.baseUrl}/oauth/access_token`, {
        params: {
          client_id: this.config.appId,
          client_secret: this.config.appSecret,
          redirect_uri: redirectUri,
          code: code
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(`Facebook Auth Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Lấy thông tin user
  async getUserInfo(accessToken) {
    try {
      const response = await axios.get(`${this.baseUrl}/me`, {
        params: {
          access_token: accessToken,
          fields: 'id,name,email,picture'
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(`Facebook API Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Lấy danh sách Pages
  async getPages(accessToken) {
    try {
      const response = await axios.get(`${this.baseUrl}/me/accounts`, {
        params: {
          access_token: accessToken,
          fields: 'id,name,access_token,category,picture'
        }
      });

      return response.data.data;
    } catch (error) {
      throw new Error(`Facebook Pages Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Đăng bài lên Facebook Page
  async publishPost(pageAccessToken, pageId, postData) {
    try {
      const endpoint = `${this.baseUrl}/${pageId}/feed`;
      
      const payload = {
        access_token: pageAccessToken,
        message: postData.message,
        published: postData.published !== false
      };

      // Thêm link nếu có
      if (postData.link) {
        payload.link = postData.link;
      }

      // Thêm hình ảnh nếu có
      if (postData.imageUrl) {
        payload.picture = postData.imageUrl;
      }

      const response = await axios.post(endpoint, payload);
      return response.data;
    } catch (error) {
      throw new Error(`Facebook Post Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Lên lịch đăng bài
  async schedulePost(pageAccessToken, pageId, postData, scheduledTime) {
    try {
      const scheduledTimestamp = Math.floor(new Date(scheduledTime).getTime() / 1000);
      
      const payload = {
        access_token: pageAccessToken,
        message: postData.message,
        published: false,
        scheduled_publish_time: scheduledTimestamp
      };

      if (postData.link) payload.link = postData.link;
      if (postData.imageUrl) payload.picture = postData.imageUrl;

      const response = await axios.post(`${this.baseUrl}/${pageId}/feed`, payload);
      return response.data;
    } catch (error) {
      throw new Error(`Facebook Schedule Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Lấy insights của Page
  async getPageInsights(pageAccessToken, pageId, metrics, period = 'day', since, until) {
    try {
      const params = {
        access_token: pageAccessToken,
        metric: metrics.join(','),
        period: period
      };

      if (since) params.since = since;
      if (until) params.until = until;

      const response = await axios.get(`${this.baseUrl}/${pageId}/insights`, { params });
      return response.data.data;
    } catch (error) {
      throw new Error(`Facebook Insights Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Lấy posts của Page
  async getPagePosts(pageAccessToken, pageId, limit = 25) {
    try {
      const response = await axios.get(`${this.baseUrl}/${pageId}/posts`, {
        params: {
          access_token: pageAccessToken,
          fields: 'id,message,created_time,likes.summary(true),comments.summary(true),shares',
          limit: limit
        }
      });

      return response.data.data;
    } catch (error) {
      throw new Error(`Facebook Posts Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Instagram Business Account functions
  async getInstagramAccount(pageAccessToken, pageId) {
    try {
      const response = await axios.get(`${this.baseUrl}/${pageId}`, {
        params: {
          access_token: pageAccessToken,
          fields: 'instagram_business_account'
        }
      });

      return response.data.instagram_business_account;
    } catch (error) {
      throw new Error(`Instagram Account Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async publishInstagramPost(pageAccessToken, instagramAccountId, postData) {
    try {
      // Bước 1: Tạo container
      const containerResponse = await axios.post(`${this.baseUrl}/${instagramAccountId}/media`, {
        access_token: pageAccessToken,
        image_url: postData.imageUrl,
        caption: postData.caption,
        media_type: postData.mediaType || 'IMAGE'
      });

      const containerId = containerResponse.data.id;

      // Bước 2: Publish container
      const publishResponse = await axios.post(`${this.baseUrl}/${instagramAccountId}/media_publish`, {
        access_token: pageAccessToken,
        creation_id: containerId
      });

      return publishResponse.data;
    } catch (error) {
      throw new Error(`Instagram Post Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

module.exports = FacebookService;