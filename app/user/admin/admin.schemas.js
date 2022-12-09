const S = require('fluent-json-schema')

const {
	responseObject,
	responseListObject
} = require('../../../config/common/schema')

const adminUserObj = S.object()
	.prop('id', S.number())
	.prop('email', S.string())
	.prop('password', S.string())
	.prop('role', S.enum(['admin', 'manager']))
	.prop('role_id', S.number())
	.prop('created_at', S.string().format('date'))
	.prop('updated_at', S.string().format('date'))

/**
 * * Schema GET /v1/users/
 */
const s_showAll = {
	response: { 200: responseListObject(adminUserObj.without(['password'])) }
}
/**
 * * Schema GET /v1/users/:id
 */
const s_show = {
	params: S.object().prop('id', S.number().required()),
	response: { 200: responseObject(adminUserObj.without(['password'])) }
}
/**
 * * Schema POST /v1/users/
 */
const s_create = {
	body: adminUserObj.only(['email', 'password', 'role_id']),
	response: { 201: responseObject() }
}
/**
 * * Schema PUT | PATCH /v1/users/:id
 */
const updateUserBody = S.object()
	.prop('email', S.string().minLength(6).maxLength(100).format('email'))
	.prop('password', S.string())
	.prop('email_verified', S.boolean())

const s_update = {
	params: S.object().prop('id', S.number().required()),
	body: updateUserBody,
	response: { 201: responseObject() }
}
/**
 * * Schema DELETE /v1/users/:id
 */
const s_destroy = {
	params: S.object().prop('id', S.number().required()),
	response: { 201: responseObject() }
}

module.exports = {
	s_showAll,
	s_show,
	s_create,
	s_update,
	s_destroy
}
