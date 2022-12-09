const S = require('fluent-json-schema')

const {
	userObject,
	responseObject,
	s_paginate
} = require('../../../config/common/schema')

/**
 * * Schema GET /v1/users/
 */
const s_showAll = {
	query: S.object()
		.prop('current_page', S.number())
		.prop('per_page', S.number()),
	response: { 200: s_paginate(userObject) }
}
/**
 * * Schema GET /v1/users/:id
 */
const s_show = {
	params: S.object().prop('id', S.number().required()),
	response: { 200: responseObject(userObject) }
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
	s_update,
	s_destroy
}
