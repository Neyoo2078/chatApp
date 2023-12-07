/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GOOGLE_APP_CLIENT_ID:
      '210615631066-7b3g8uoq727ukmjukn255rbue8aunlv2.apps.googleusercontent.com',
    GOOGLE_APP_CLIENT_SECRET: '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',
    NEXTAUTH_SECRET: 'AE2JRi5N07X334BzPSOae7/yZNTvHn+JX6D0Zs4HLIU=',
    NEXTAUTH_URL_INTERNAL: 'http://localhost:3000',
    NEXT_PUBLIC_SITE_URL: 'http://localhost:5000',
    WEB_SERVER: 'https://whatapp-server-mgyi.onrender.com',
    TWITTER_ID: '',
    TWITTER_SECRET: '',
    SERVER_URL: 'http://localhost:3001',
    ZEGOAPP_ID: '1959285735',
    ZEGO_SERVER_SECRET: 'fc3851fb17534ce7a33867f1f4b934a0',
  },
};

module.exports = nextConfig;
