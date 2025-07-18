const { google } = require('googleapis');
const config = require('../config/socialPlatforms');

class YouTubeService {
  constructor() {
    this.config = config.youtube;
    this.oauth2Client = new google.auth.OAuth2(
      this.config.clientId,
      this.config.clientSecret
    );
    this.youtube = google.youtube({ version: 'v3', auth: this.oauth2Client });
  }

  // Tạo URL OAuth
  getAuthUrl(redirectUri, state) {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.config.scopes,
      redirect_uri: redirectUri,
      state: state
    });
  }

  // Lấy access token
  async getAccessToken(code, redirectUri) {
    try {
      this.oauth2Client.setRedirectUri(redirectUri);
      const { tokens } = await this.oauth2Client.getToken(code);
      return tokens;
    } catch (error) {
      throw new Error(`YouTube Auth Error: ${error.message}`);
    }
  }

  // Set credentials
  setCredentials(tokens) {
    this.oauth2Client.setCredentials(tokens);
  }

  // Refresh access token
  async refreshAccessToken(refreshToken) {
    try {
      this.oauth2Client.setCredentials({ refresh_token: refreshToken });
      const { credentials } = await this.oauth2Client.refreshAccessToken();
      return credentials;
    } catch (error) {
      throw new Error(`YouTube Refresh Error: ${error.message}`);
    }
  }

  // Lấy thông tin channel
  async getChannelInfo(accessToken) {
    try {
      this.setCredentials({ access_token: accessToken });
      
      const response = await this.youtube.channels.list({
        part: ['snippet', 'statistics', 'brandingSettings'],
        mine: true
      });

      return response.data.items[0];
    } catch (error) {
      throw new Error(`YouTube Channel Error: ${error.message}`);
    }
  }

  // Upload video
  async uploadVideo(accessToken, videoData, metadata) {
    try {
      this.setCredentials({ access_token: accessToken });

      const response = await this.youtube.videos.insert({
        part: ['snippet', 'status'],
        requestBody: {
          snippet: {
            title: metadata.title,
            description: metadata.description,
            tags: metadata.tags || [],
            categoryId: metadata.categoryId || '22', // People & Blogs
            defaultLanguage: metadata.language || 'vi',
            defaultAudioLanguage: metadata.language || 'vi'
          },
          status: {
            privacyStatus: metadata.privacyStatus || 'private', // private, public, unlisted
            publishAt: metadata.publishAt || undefined,
            selfDeclaredMadeForKids: metadata.madeForKids || false
          }
        },
        media: {
          body: videoData
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(`YouTube Upload Error: ${error.message}`);
    }
  }

  // Cập nhật video
  async updateVideo(accessToken, videoId, metadata) {
    try {
      this.setCredentials({ access_token: accessToken });

      const response = await this.youtube.videos.update({
        part: ['snippet', 'status'],
        requestBody: {
          id: videoId,
          snippet: {
            title: metadata.title,
            description: metadata.description,
            tags: metadata.tags,
            categoryId: metadata.categoryId
          },
          status: {
            privacyStatus: metadata.privacyStatus
          }
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(`YouTube Update Error: ${error.message}`);
    }
  }

  // Lấy danh sách video
  async getChannelVideos(accessToken, maxResults = 25, pageToken = null) {
    try {
      this.setCredentials({ access_token: accessToken });

      // Lấy channel ID trước
      const channelResponse = await this.youtube.channels.list({
        part: ['contentDetails'],
        mine: true
      });

      const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

      // Lấy videos từ uploads playlist
      const response = await this.youtube.playlistItems.list({
        part: ['snippet', 'contentDetails'],
        playlistId: uploadsPlaylistId,
        maxResults: maxResults,
        pageToken: pageToken
      });

      return response.data;
    } catch (error) {
      throw new Error(`YouTube Videos Error: ${error.message}`);
    }
  }

  // Lấy analytics
  async getVideoAnalytics(accessToken, videoId, metrics, startDate, endDate) {
    try {
      this.setCredentials({ access_token: accessToken });

      const youtubeAnalytics = google.youtubeAnalytics({ version: 'v2', auth: this.oauth2Client });

      const response = await youtubeAnalytics.reports.query({
        ids: 'channel==MINE',
        startDate: startDate,
        endDate: endDate,
        metrics: metrics.join(','), // views,likes,dislikes,comments,shares,estimatedMinutesWatched
        dimensions: 'video',
        filters: `video==${videoId}`
      });

      return response.data;
    } catch (error) {
      throw new Error(`YouTube Analytics Error: ${error.message}`);
    }
  }

  // Lấy channel analytics
  async getChannelAnalytics(accessToken, metrics, startDate, endDate, dimensions = null) {
    try {
      this.setCredentials({ access_token: accessToken });

      const youtubeAnalytics = google.youtubeAnalytics({ version: 'v2', auth: this.oauth2Client });

      const params = {
        ids: 'channel==MINE',
        startDate: startDate,
        endDate: endDate,
        metrics: metrics.join(',')
      };

      if (dimensions) {
        params.dimensions = dimensions.join(',');
      }

      const response = await youtubeAnalytics.reports.query(params);
      return response.data;
    } catch (error) {
      throw new Error(`YouTube Channel Analytics Error: ${error.message}`);
    }
  }

  // Tìm kiếm video
  async searchVideos(query, maxResults = 25, order = 'relevance') {
    try {
      const youtube = google.youtube({ 
        version: 'v3', 
        auth: this.config.apiKey 
      });

      const response = await youtube.search.list({
        part: ['snippet'],
        q: query,
        type: 'video',
        maxResults: maxResults,
        order: order, // relevance, date, rating, viewCount, title
        regionCode: 'VN',
        relevanceLanguage: 'vi'
      });

      return response.data;
    } catch (error) {
      throw new Error(`YouTube Search Error: ${error.message}`);
    }
  }

  // Lấy trending videos
  async getTrendingVideos(regionCode = 'VN', categoryId = null, maxResults = 25) {
    try {
      const youtube = google.youtube({ 
        version: 'v3', 
        auth: this.config.apiKey 
      });

      const params = {
        part: ['snippet', 'statistics'],
        chart: 'mostPopular',
        regionCode: regionCode,
        maxResults: maxResults
      };

      if (categoryId) {
        params.videoCategoryId = categoryId;
      }

      const response = await youtube.videos.list(params);
      return response.data;
    } catch (error) {
      throw new Error(`YouTube Trending Error: ${error.message}`);
    }
  }

  // Lấy video categories
  async getVideoCategories(regionCode = 'VN') {
    try {
      const youtube = google.youtube({ 
        version: 'v3', 
        auth: this.config.apiKey 
      });

      const response = await youtube.videoCategories.list({
        part: ['snippet'],
        regionCode: regionCode,
        hl: 'vi'
      });

      return response.data;
    } catch (error) {
      throw new Error(`YouTube Categories Error: ${error.message}`);
    }
  }

  // Tạo playlist
  async createPlaylist(accessToken, title, description, privacyStatus = 'private') {
    try {
      this.setCredentials({ access_token: accessToken });

      const response = await this.youtube.playlists.insert({
        part: ['snippet', 'status'],
        requestBody: {
          snippet: {
            title: title,
            description: description,
            defaultLanguage: 'vi'
          },
          status: {
            privacyStatus: privacyStatus
          }
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(`YouTube Playlist Error: ${error.message}`);
    }
  }

  // Thêm video vào playlist
  async addVideoToPlaylist(accessToken, playlistId, videoId) {
    try {
      this.setCredentials({ access_token: accessToken });

      const response = await this.youtube.playlistItems.insert({
        part: ['snippet'],
        requestBody: {
          snippet: {
            playlistId: playlistId,
            resourceId: {
              kind: 'youtube#video',
              videoId: videoId
            }
          }
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(`YouTube Add to Playlist Error: ${error.message}`);
    }
  }
}

module.exports = YouTubeService;