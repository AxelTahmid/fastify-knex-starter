const { getCache } = require('./services')

const commonFetchList = async (app, query, key, message) => {
	let data = await getCache(app, key)

	if (!data) {
		data = await query(app)
		app.redis.set(key, JSON.stringify(data))
	}

	return {
		error: false,
		message,
		data
	}
}
/**
 * * Call in a handler like this
 */
//  const response_data = await commonFetchList(
//     this,
//     categoryList,
//     'acs:category',
//     'Category List Fetched!'
//   )

module.exports = { commonFetchList }
