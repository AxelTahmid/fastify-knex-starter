const bcrypt = require('../../../config/plugins/bcrypt')

const { showAll, show, create, update, destroy } = require('./admin.handlers')
const {
	s_showAll,
	s_show,
	s_create,
	s_update,
	s_destroy
} = require('./admin.schemas')

module.exports = async function (fastify) {
	fastify.register(bcrypt)

	fastify.route({
		method: 'GET',
		url: '/',
		onRequest: fastify.role.admin,
		schema: s_showAll,
		handler: showAll
	})

	fastify.route({
		method: 'GET',
		url: '/:id',
		onRequest: fastify.role.admin,
		schema: s_show,
		handler: show
	})

	fastify.route({
		method: 'POST',
		url: '/',
		onRequest: fastify.role.admin,
		schema: s_create,
		handler: create
	})

	fastify.route({
		method: 'PATCH',
		url: '/:id',
		onRequest: fastify.role.admin,
		schema: s_update,
		handler: update
	})

	fastify.route({
		method: 'DELETE',
		url: '/:id',
		onRequest: fastify.role.admin,
		schema: s_destroy,
		handler: destroy
	})
}
