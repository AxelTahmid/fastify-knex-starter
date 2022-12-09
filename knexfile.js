const { resolve } = require('node:path')

module.exports = {
	postgres: {
		client: 'pg',
		connection:
			process.env.PG_CONNECTION_STRING ||
			'postgres://postgres@localhost/arektacoinpg',
		migrations: {
			tableName: 'knex_migrations',
			directory: resolve(__dirname, 'database/migrations')
		},
		seeds: {
			directory: resolve(__dirname, 'database/seeds')
		}
	},
	development: {
		client: 'mysql2',
		acquireConnectionTimeout: 10000,
		pool: {
			min: 1,
			max: 10
		},
		migrations: {
			tableName: 'knex_migrations',
			directory: resolve(__dirname, 'database/migrations')
		},
		seeds: {
			directory: resolve(__dirname, 'database/seeds')
		},
		connection: {
			host: process.env.DB_HOST || 'localhost',
			user: process.env.DB_USER || 'root',
			password: process.env.DB_PASSWORD || '',
			database: process.env.DB_NAME || 'arektacoinstore',
			port: process.env.DB_PORT || '3306'
		},
		asyncStackTraces: true,
		debug: true
	}
}
