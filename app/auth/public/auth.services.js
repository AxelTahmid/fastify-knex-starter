const { getCache } = require('../../../config/common/services')
/**
 * * Fetch User by Email
 */
const fetchUser = async (app, id) => {
	const [user, order_history] = await Promise.all([
		app.knex('user_customers').where('id', id).first(),
		app.knex('orders').where('user_id', id)
	])

	if (!user) throw app.httpErrors.notFound('User not found!')

	if (order_history.length) {
		const promises = order_history.map(async el => {
			if (el.status === 'delivered') {
				const orderItems = await app
					.knex('order_items')
					.where('order_id', el.id)
					.select('id')
				const orderItemIDs = orderItems.map(el => el.id)
				el.license_keys = await app
					.knex('product_keys')
					.whereIn('product_keys.order_items_id', orderItemIDs)
					.leftJoin('products', 'product_keys.product_id', '=', 'products.id')
					.select('product_keys.code as code', 'products.slug as product_slug')
			}
		})
		await Promise.all(promises)
	}

	return { ...user, role: 'customer', order_history }
}
/**
 * * Authenticate passed user
 */
const authenticate = async (app, props) => {
	const { email, password } = props || {}
	const key = `acs:timeout:${email}`
	let count = await getCache(app, key)
	if (count >= 5) {
		throw app.httpErrors.forbidden('5 Wrong Attempts! Try again in 5 minutes.')
	}

	const user = await app.knex('user_customers').where('email', email).first()

	if (!user) throw app.httpErrors.notFound(`User: ${email}, not found!`)

	const match = await app.bcrypt.compare(password, user.password)

	if (!match) {
		count++
		await app.redis.setex(key, 300, count.toString())
		throw app.httpErrors.forbidden('Password Incorrect!')
	}

	return await app.auth.token(user)
}
/**
 * * Create User via Registration
 */
const registration = async (app, props) => {
	let { email, password } = props || {}

	const user = await app.knex('user_customers').where('email', email).first()

	if (user)
		throw app.httpErrors.badRequest(
			`User: ${email} already exists! Please Login`
		)

	password = await app.bcrypt.hash(password)

	return await app.knex('user_customers').insert({ email, password })
}

const verifyUserEmail = async (app, email) => {
	const isUpdated = await app
		.knex('user_customers')
		.where('email', email)
		.update({ email_verified: true })

	if (!isUpdated) throw app.httpErrors.notFound(`User: ${email}, not found!`)

	const user = await app.knex('user_customers').where('email', email).first()
	return await app.auth.token({ ...user, role: 'customer' })
}

const updateUserPassword = async (app, props) => {
	const { email, password } = props || {}

	const hashedPassword = await app.bcrypt.hash(password)

	const isUpdated = await app
		.knex('user_customers')
		.where('email', email)
		.update({ password: hashedPassword })

	if (!isUpdated) throw app.httpErrors.notFound(`User: ${email}, not found!`)
}

/**
 * * Generate OTP Code
 */
const getOTP = async (app, email) => {
	const otp = Math.floor(Math.random() * 90000) + 10000

	//* 30 minute expiry
	await app.redis.setex(`OTP:${email}`, 1800, otp.toString())
	return otp.toString()
}
/**
 * * Verify OTP Code
 */
const verifyOTP = async (app, props) => {
	const key = `OTP:${props.email}`

	return await app.redis.get(key, async (error, otp) => {
		if (error) app.log.error(error)

		if (otp != null && otp === props.code) {
			await revokeOTP(app, key)
			return true
		} else {
			return false
		}
	})
}
/**
 * * Revoke OTP
 */
const revokeOTP = async (app, key) => {
	await app.redis.del(key, (err, response) => {
		if (err) app.log.error(err)
		if (response === 1) {
			app.log.info(`${key} revoked`)
		} else {
			app.log.info('no action')
		}
	})
}

module.exports = {
	registration,
	authenticate,
	fetchUser,
	getOTP,
	verifyOTP,
	verifyUserEmail,
	updateUserPassword
}
