module.exports = {
  apps: [{
    name: 'pos-server',
    script: 'dist/index.js',
    cwd: '/var/www/pos/packages/server',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001,
    }
  }]
};

