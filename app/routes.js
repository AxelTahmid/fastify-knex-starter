const authPublicRoutes = require('./auth/public')
const authAdminRoutes = require('./auth/admin')
const userAdminRoutes = require('./user/admin')
const userCustomerRoutes = require('./user/customer')
const galleryRoutes = require('./gallery')

module.exports = async function (fastify) {
	fastify.setNotFoundHandler(
		{
			preHandler: fastify.rateLimit({
				max: 3,
				timeWindow: 1000 * 60
			})
		},
		function (request, reply) {
			reply.code(404).send({ error: true, message: '404 - Route Not Found' })
		}
	)
	/**
	 * * Entrypoint Cache Test
	 */
	fastify.get('/', async function (request, reply) {
		let data = await fastify.redis.get('acs:hello')

		if (!data) {
			data = 'Hello World'
			this.redis.set('acs:hello', 'Redis => API for ArektaCoinStore')
		}

		reply.code(200)
		return {
			error: false,
			message: data
		}
	})

	/**
	 * * Global Redis Flush
	 */
	fastify.post(
		'/flush',
		{ onRequest: fastify.role.admin },
		async function (request, reply) {
			await fastify.redis.flushall('ASYNC', (error, data) => {
				if (error) fastify.log.error(error)
				if (data === 'OK') {
					fastify.log.info('Redis Cache flushed.')
				}
			})

			reply.code(200)
			return {
				error: false,
				message: 'Redis globally flushed'
			}
		}
	)

	/**
	 * * Service Routes Registration with Prefix
	 */
	fastify.register(authPublicRoutes, { prefix: '/v1/auth' })
	fastify.register(authAdminRoutes, { prefix: '/v1/admin/auth' })
	fastify.register(galleryRoutes, { prefix: '/v1/gallery' })
	fastify.register(userAdminRoutes, { prefix: '/v1/user/admin' })
	fastify.register(userCustomerRoutes, { prefix: '/v1/user/customer' })
}
