const {
	userList,
	userById,
	updateUser,
	deleteUser
} = require('./customer.services')

/**
 * * Handler GET /v1/users/
 */
const showAll = async function (request, reply) {
	const data = await userList(this, request.query)

	reply.code(200)

	return {
		error: false,
		message: 'Customer List Fetched!',
		data
	}
}
/**
 * * Handler GET /v1/users/:id
 */
const show = async function (request, reply) {
	const id = request.params.id

	const data = await userById(this, id)

	reply.code(200)

	return {
		error: false,
		message: `Customer ID: ${id} Fetched!`,
		data
	}
}

/**
 * * Handler PUT | PATCH /v1/users/:id
 */
const update = async function (request, reply) {
	await updateUser(this, request.params.id, request.body)

	reply.code(201)

	return {
		error: false,
		message: 'Customer User Updated'
	}
}

/**
 * * Handler DELETE /v1/users/:id
 */
const destroy = async function (request, reply) {
	const id = request.params.id
	await deleteUser(this, id)

	reply.code(200)
	return {
		error: false,
		message: `Customer User: ${id} deleted.`
	}
}

module.exports = { showAll, show, update, destroy }
