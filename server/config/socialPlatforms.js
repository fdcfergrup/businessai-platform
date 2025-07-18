const socialPlatformConfig = {
  facebook: {
    appId: process.env.FACEBOOK_APP_ID,
    appSecret: process.env.FACEBOOK_APP_SECRET,
    apiVersion: 'v18.0',
    baseUrl: 'https://graph.facebook.com',
    scopes: [
      'pages_manage_posts',
      'pages_read_engagement',
      'pages_show_list',
      'business_management',
      'instagram_basic',
      'instagram_content_publish'
    ]
  },
  
  tiktok: {
    clientKey: process.env.TIKTOK_CLIENT_KEY,
    clientSecret: process.env.TIKTOK_CLIENT_SECRET,
    apiVersion: 'v1',
    baseUrl: 'https://open-api.tiktok.com',
    scopes: [
      'user.info.basic',
      'video.list',
      'video.upload',
      'video.publish'
    ]
  },
  
  youtube: {
    clientId: process.env.YOUTUBE_CLIENT_ID,
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET,
    apiKey: process.env.YOUTUBE_API_KEY,
    apiVersion: 'v3',
    baseUrl: 'https://www.googleapis.com/youtube',
    scopes: [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/youtube.force-ssl'
    ]
  },
  
  instagram: {
    // Instagram uses Facebook Graph API
    baseUrl: 'https://graph.instagram.com',
    apiVersion: 'v18.0'
  }
};

module.exports = socialPlatformConfig;