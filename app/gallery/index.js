const { default: fastifyMultipart } = require('@fastify/multipart')
const s3object = require('../../config/plugins/s3object')

const {
	flush,
	gallery,
	upload,
	destroy,
	destroyMany
} = require('./gallery.handlers')

const {
	s_gallery,
	s_upload,
	s_destroy,
	s_destroyMany
} = require('./gallery.schema')
const { s_flush } = require('../../config/common/schema')

module.exports = async function (fastify) {
	fastify.register(fastifyMultipart, {
		limits: {
			fieldNameSize: 100, // Max field name size in bytes
			fieldSize: 100, // Max field value size in bytes
			fields: 2, // Max number of non-file fields
			fileSize: 1000000, // the max file size in bytes, 1MB
			files: 1 // Max number of file fields
		}
	})

	const s3credentials = {
		requestHandler: fastify.request,
		// logger: fastify.log,
		forcePathStyle: true,
		endpoint: process.env.S3_ENDPOINT,
		region: process.env.S3_REGION,
		credentials: {
			accessKeyId: process.env.S3_ACCESS_KEY,
			secretAccessKey: process.env.S3_SECRET_PASSWORD
		}
	}

	fastify.register(s3object, s3credentials)

	fastify.route({
		method: 'GET',
		url: '/',
		schema: s_gallery,
		handler: gallery
	})

	fastify.route({
		method: 'PUT',
		url: '/upload',
		onRequest: fastify.role.restricted,
		schema: s_upload,
		handler: upload
	})

	fastify.route({
		method: 'POST',
		url: '/flush',
		onRequest: fastify.role.restricted,
		schema: s_flush,
		handler: flush
	})

	fastify.route({
		method: 'DELETE',
		url: '/selected',
		onRequest: fastify.role.restricted,
		schema: s_destroyMany,
		handler: destroyMany
	})

	fastify.route({
		method: 'DELETE',
		url: '/',
		onRequest: fastify.role.restricted,
		schema: s_destroy,
		handler: destroy
	})
}
