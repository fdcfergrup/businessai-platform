const axios = require('axios');
const crypto = require('crypto');
const config = require('../config/socialPlatforms');

class TikTokService {
  constructor() {
    this.config = config.tiktok;
    this.baseUrl = `${this.config.baseUrl}/${this.config.apiVersion}`;
  }

  // Tạo URL OAuth
  getAuthUrl(redirectUri, state) {
    const csrfState = crypto.randomBytes(16).toString('hex');
    
    const params = new URLSearchParams({
      client_key: this.config.clientKey,
      scope: this.config.scopes.join(','),
      response_type: 'code',
      redirect_uri: redirectUri,
      state: state || csrfState
    });

    return `https://www.tiktok.com/auth/authorize/?${params.toString()}`;
  }

  // Lấy access token
  async getAccessToken(code, redirectUri) {
    try {
      const response = await axios.post(`${this.baseUrl}/oauth/token/`, {
        client_key: this.config.clientKey,
        client_secret: this.config.clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      return response.data.data;
    } catch (error) {
      throw new Error(`TikTok Auth Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Refresh access token
  async refreshAccessToken(refreshToken) {
    try {
      const response = await axios.post(`${this.baseUrl}/oauth/refresh_token/`, {
        client_key: this.config.clientKey,
        client_secret: this.config.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      });

      return response.data.data;
    } catch (error) {
      throw new Error(`TikTok Refresh Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Lấy thông tin user
  async getUserInfo(accessToken) {
    try {
      const response = await axios.post(`${this.baseUrl}/user/info/`, {
        access_token: accessToken,
        fields: ['open_id', 'union_id', 'avatar_url', 'display_name']
      });

      return response.data.data.user;
    } catch (error) {
      throw new Error(`TikTok User Info Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Upload video
  async uploadVideo(accessToken, videoData) {
    try {
      // Bước 1: Khởi tạo upload
      const initResponse = await axios.post(`${this.baseUrl}/post/publish/inbox/video/init/`, {
        access_token: accessToken,
        source_info: {
          source: 'FILE_UPLOAD',
          video_size: videoData.size,
          chunk_size: videoData.chunkSize || 10485760, // 10MB chunks
          total_chunk_count: Math.ceil(videoData.size / (videoData.chunkSize || 10485760))
        }
      });

      const publishId = initResponse.data.data.publish_id;
      const uploadUrl = initResponse.data.data.upload_url;

      // Bước 2: Upload video chunks
      // Trong thực tế, bạn sẽ cần chia video thành chunks và upload từng chunk
      const uploadResponse = await axios.put(uploadUrl, videoData.buffer, {
        headers: {
          'Content-Type': 'video/mp4',
          'Content-Range': `bytes 0-${videoData.size - 1}/${videoData.size}`
        }
      });

      return { publishId, uploadResponse: uploadResponse.data };
    } catch (error) {
      throw new Error(`TikTok Upload Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Publish video
  async publishVideo(accessToken, publishId, postData) {
    try {
      const response = await axios.post(`${this.baseUrl}/post/publish/`, {
        access_token: accessToken,
        post_info: {
          title: postData.title,
          description: postData.description,
          privacy_level: postData.privacyLevel || 'SELF_ONLY', // PUBLIC_TO_EVERYONE, MUTUAL_FOLLOW_FRIENDS, SELF_ONLY
          disable_duet: postData.disableDuet || false,
          disable_comment: postData.disableComment || false,
          disable_stitch: postData.disableStitch || false,
          video_cover_timestamp_ms: postData.coverTimestamp || 1000
        },
        source_info: {
          source: 'FILE_UPLOAD',
          publish_id: publishId
        }
      });

      return response.data.data;
    } catch (error) {
      throw new Error(`TikTok Publish Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Lấy danh sách video
  async getUserVideos(accessToken, cursor = 0, maxCount = 20) {
    try {
      const response = await axios.post(`${this.baseUrl}/post/publish/status/fetch/`, {
        access_token: accessToken,
        cursor: cursor,
        max_count: maxCount
      });

      return response.data.data;
    } catch (error) {
      throw new Error(`TikTok Videos Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Lấy analytics
  async getVideoAnalytics(accessToken, videoIds, fields) {
    try {
      const response = await axios.post(`${this.baseUrl}/post/publish/video/analytics/`, {
        access_token: accessToken,
        video_ids: videoIds,
        fields: fields || [
          'like_count',
          'comment_count',
          'share_count',
          'view_count'
        ]
      });

      return response.data.data;
    } catch (error) {
      throw new Error(`TikTok Analytics Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Lấy trending hashtags
  async getTrendingHashtags(accessToken) {
    try {
      const response = await axios.post(`${this.baseUrl}/research/hashtag/trending/`, {
        access_token: accessToken
      });

      return response.data.data;
    } catch (error) {
      throw new Error(`TikTok Trending Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Tìm kiếm hashtags
  async searchHashtags(accessToken, keyword) {
    try {
      const response = await axios.post(`${this.baseUrl}/research/hashtag/search/`, {
        access_token: accessToken,
        keyword: keyword
      });

      return response.data.data;
    } catch (error) {
      throw new Error(`TikTok Hashtag Search Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

module.exports = TikTokService;