/**
 * * https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/s3-example-creating-buckets.html
 * * https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javascriptv3/example_code/s3/README.md
 */
const { getCache } = require('../../config/common/services')
const {
	ListObjectsCommand,
	PutObjectCommand,
	DeleteObjectCommand,
	DeleteObjectsCommand
} = require('@aws-sdk/client-s3')

const Bucket = process.env.S3_BUCKET
/**
 * * Handler GET /v1/gallery/flush
 */
const flush = async function (request, reply) {
	await this.redis.del('acs:gallery:list')

	reply.code(200)
	return {
		error: false,
		message: 'Media Cache Removed'
	}
}
/**
 * * Handler GET /v1/gallery/
 */
const gallery = async function (request, reply) {
	const rediskey = 'acs:gallery:list'

	let data = await getCache(this, rediskey)

	if (!data) {
		data = await this.s3.send(
			new ListObjectsCommand({ Bucket, Prefix: 'acs/' })
		)

		data.Contents.forEach(_ => {
			_.Url = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${_.Key}`
		})
		this.redis.set(rediskey, JSON.stringify(data))
	}

	reply.code(200)
	return {
		error: false,
		message: 'Media List Fetched!',
		data
	}
}
/**
 * * Handler POST /v1/gallery/upload
 * * will upload or update on key
 */
const upload = async function (request, reply) {
	const { Key } = request.query

	const data = await request.file()
	const buffer = await data.toBuffer()

	const allowedMimes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp']

	if (!allowedMimes.includes(data.mimetype)) {
		throw this.httpErrors.notAcceptable(`Type: ${data.mimetype} not allowed!`)
	}

	const uploadParams = {
		Bucket,
		Key: Key.startsWith('acs/') ? Key : `acs/${Key}`,
		Body: buffer
	}

	await this.s3.send(new PutObjectCommand(uploadParams))

	this.redis.del('acs:gallery:list')

	reply.code(201)
	return {
		error: false,
		message: 'Media Created'
	}
}

/**
 * * Handler DELETE /v1/gallery/:key
 */
const destroy = async function (request, reply) {
	const { Key } = request.query

	await this.s3.send(new DeleteObjectCommand({ Bucket, Key }))

	this.redis.del('acs:gallery:list')

	reply.code(201)
	return {
		error: false,
		message: `Media: ${Key} deleted.`
	}
}

/**
 * * Handler DELETE /v1/gallery/:key
 */
const destroyMany = async function (request, reply) {
	await this.s3.send(new DeleteObjectsCommand({ Bucket, Delete: request.body }))

	this.redis.del('acs:gallery:list')

	reply.code(201)
	return {
		error: false,
		message: 'Selected Files deleted'
	}
}

module.exports = { flush, gallery, upload, destroy, destroyMany }
