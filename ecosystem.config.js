module.exports = {
	apps: [ {
		script: 'bin/www.js',
		instances: 1,
		autorestart: true,
		watch: false,
		max_memory_restart: '2G',
		env: {
			PORT: 3000,
			name: 'fs_dev',
			NODE_ENV: 'development'
		},
		env_production: {
			PORT: 3000,
			name: 'fs_pro',
			NODE_ENV: 'production'
		}
	} ]
};
