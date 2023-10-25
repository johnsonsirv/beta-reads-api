const config = {
  env: process.NODE_ENV || 'dev',
  appName: 'BRaaS',
  mongodb: {
    url: process.env.url || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'my-server-key',
    expiresIn: 30000,
  },
};

module.exports = config;
