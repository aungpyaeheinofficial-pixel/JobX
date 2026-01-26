// PM2 Ecosystem Configuration for JobX Backend
// Using .cjs extension to work with ES modules in package.json
module.exports = {
  apps: [{
    name: 'jobx-backend',
    script: './server.js',
    instances: 2, // Run 2 instances for load balancing
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 9999
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '500M',
    watch: false,
    ignore_watch: ['node_modules', 'logs', 'uploads'],
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000,
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000
  }]
};
