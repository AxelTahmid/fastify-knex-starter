require('dotenv').config()

const Fastify = require('fastify')
const closeWithGrace = require('close-with-grace')

let dev = process.env.NODE_ENV

if (dev && dev === 'development') {
	dev = true
} else {
	dev = false
}

/**
 * * give array of ip for trustproxy in production
 */
const app = Fastify({
	trustProxy: true,
	logger: {
		transport: dev
			? {
					target: 'pino-pretty',
					options: {
						translateTime: 'HH:MM:ss Z',
						ignore: 'pid,hostname'
					}
			  }
			: undefined
	}
})
// * configuration decorator and defaults
app
	.decorate('conf', require('./config/common/config'))
	.register(require('@fastify/helmet'), { global: true })
	.register(require('@fastify/cors'), app.conf.cors)
	.register(require('@fastify/formbody'))
	.register(require('./config/plugins/jwt'))
	.register(require('@fastify/sensible'))
/**
 * * redis, because rate limit wants raw connection
 */
const Redis = require('ioredis')
const client = new Redis(app.conf.redis)
app.register(require('@fastify/redis'), { client })
/**
 * * Rate limit setup
 */
app.conf.rate_limit.redis = client
app.register(require('@fastify/rate-limit'), app.conf.rate_limit)
/**
 * * MySQL Database
 */
const knex = require('./config/plugins/knex')
if (dev) {
	app.log.info('db: development')
	const { development } = require('./knexfile')
	app.register(knex, development)
} else {
	app.log.info('db: production')
	app.register(knex, app.conf.sql)
}

/**
 * * Register the app directory
 */
app.register(require('./app/routes'))

/**
 * * delay is the number of milliseconds for the graceful close to finish
 */
const closeListeners = closeWithGrace(
	{ delay: 2000 },
	async function ({ err }) {
		app.log.info('graceful shutdown -> entered')
		if (err) {
			app.log.error(err)
		}
		await app.close()
	}
)

app.addHook('onClose', async (instance, done) => {
	closeListeners.uninstall()
	app.log.info('graceful shutdown -> sucessful')
	done()
})

// * Run the server!
const start = async () => {
	try {
		await app.listen({
			port: process.env.PORT || 3000,
			host: process.env.HOST || '0.0.0.0'
		})
	} catch (err) {
		app.log.error(err)
		process.exit(1)
	}
}

start()
