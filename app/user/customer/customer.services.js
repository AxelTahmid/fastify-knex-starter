const { paginate } = require('../../../config/common/services')
/**
 * * get all users
 * TODO add filter
 */
const userList = async (app, props) => {
	const { per_page, current_page } = props || {}

	return await paginate(app.knex, {
		table: 'user_customers',
		per_page,
		current_page
	})
}

/**
 * * get user by id
 */
const userById = async (app, id) => {
	const user = await app.knex('user_customers').where('id', id).first()

	if (!user) throw app.httpErrors.notFound(`User with ID: ${id} not found!`)

	return user
}
/**
 * * update user email or password
 */
const updateUser = async (app, id, props) => {
	await userById(app, id)

	let { email, email_verified, password, is_banned } = props || {}

	if (password) {
		password = await app.bcrypt.hash(password)
	}

	return await app
		.knex('user_customers')
		.where('id', id)
		.update({ email, email_verified, password, is_banned })
}
/**
 * * delete a user by id
 */
const deleteUser = async (app, id) => {
	const isDeleted = await app.knex('user_customers').where('id', id).del()

	if (!isDeleted)
		throw app.httpErrors.notFound(`User with ID: ${id} not found!`)

	return isDeleted
}

module.exports = { userList, userById, updateUser, deleteUser }
