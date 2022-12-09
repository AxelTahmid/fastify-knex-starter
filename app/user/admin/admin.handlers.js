const {
	userList,
	userById,
	createUser,
	updateUser,
	deleteUser
} = require('./admin.services')

/**
 * * Handler GET /v1/users/
 */
const showAll = async function (request, reply) {
	const data = await userList(this)

	reply.code(200)

	return {
		error: false,
		message: 'Admin List Fetched!',
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
		message: `Admin ID: ${id} Fetched!`,
		data
	}
}
/**
 * * Handler POST /v1/users/
 */
const create = async function (request, reply) {
	const { role } = await createUser(this, request.body)

	reply.code(201)

	return {
		error: false,
		message: `${role} user created`
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
		message: 'Admin User Updated'
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
		message: `Admin User: ${id} deleted.`
	}
}

module.exports = { showAll, show, create, update, destroy }
