require('dotenv').config();

module.exports = {
  apps: [{
    name: 'app',
    script: 'dist/app.js',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
}; 