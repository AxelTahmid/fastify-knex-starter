/**
 * * get all users
 */
const userList = async app => {
	return await app
		.knex('user_admins')
		.leftJoin('user_roles', 'user_admins.role_id', '=', 'user_roles.id')
}

/**
 * * get user by id
 */
const userById = async (app, id) => {
	const user = await app
		.knex('user_admins')
		.where('user_admins.id', id)
		.leftJoin('user_roles', 'user_admins.role_id', '=', 'user_roles.id')
		.first()

	if (!user) throw app.httpErrors.notFound(`User with ID: ${id} not found!`)

	return user
}
/**
 * * create a user
 */
const createUser = async (app, props) => {
	const { email, role_id, password } = props || {}

	const user = await app.knex('users').where('email', email).first()

	if (user)
		throw app.httpErrors.badRequest(
			`User: ${user.email} already exists! Please Login`
		)

	const hashedPassword = await app.bcrypt.hash(password)

	return await app
		.knex('users')
		.insert({ email, role_id, password: hashedPassword })
}
/**
 * * update user email or password
 */
const updateUser = async (app, id, props) => {
	let { email, password, role_id } = props || {}

	if (password) {
		password = await app.bcrypt.hash(password)
	}

	const userID = await app
		.knex('users')
		.where('id', id)
		.update({ email, password, role_id })

	return await userById(app, userID)
}
/**
 * * delete a user by id
 */
const deleteUser = async (app, id) => {
	const isDeleted = await app.knex('users').where('id', id).del()

	if (!isDeleted) throw app.httpErrors.notFound(`User ID: ${id} not found!`)

	return isDeleted
}

module.exports = { userList, createUser, userById, updateUser, deleteUser }
