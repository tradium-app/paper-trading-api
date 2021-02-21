require('dotenv').config()

module.exports = {
	apps: [
		{
			name: 'hypergrowth.api',
			script: 'src/server.js',
			instances: process.env.INSTANCES_API || 1,
			autorestart: true,
			watch: process.env.NODE_ENV == 'development' ? ['src', '*.js', '*.ts', '.env'] : false,
			watch_delay: 5000,
			ignore_watch: ['node_modules', 'assets', 'docs', 'newrelic_agent.log', '.git'],
			max_memory_restart: process.env.APP_MEMORY_LIMIT || '2G',
		},
		{
			name: 'hypergrowth.worker',
			script: 'src/worker.js',
			instances: process.env.INSTANCES_WORKER || 1,
			autorestart: true,
			watch: process.env.NODE_ENV == 'development' ? ['src', '*.js', '*.ts', '.env'] : false,
			watch_delay: 5000,
			ignore_watch: ['node_modules', 'assets', 'docs', 'newrelic_agent.log', '.git'],
			max_memory_restart: process.env.APP_MEMORY_LIMIT || '2G',
		},
	],
}
