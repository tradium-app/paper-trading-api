require('dotenv').config()

module.exports = {
	apps: [
		{
			name: 'nepaltoday.api',
			script: 'index.js',
			instances: process.env.APP_INSTANCES || 'max',
			autorestart: true,
			watch: process.env.NODE_ENV == 'development' ? ['src', '*.js', '*.ts'] : false,
			watch_delay: 2000,
			ignore_watch: ['node_modules', 'assets', 'docs', 'newrelic_agent.log', '.git'],
			max_memory_restart: process.env.APP_MEMORY_LIMIT || '2G',
		},
	],
}
