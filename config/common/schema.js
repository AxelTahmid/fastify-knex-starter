const S = require('fluent-json-schema')

const validate = { slug: '^[a-z0-9]+(?:-[a-z0-9]+)*$' }

const responseObject = data =>
	S.object()
		.prop('error', S.boolean().required())
		.prop('message', S.string().required())
		.prop('data', data)

const responseListObject = data =>
	S.object()
		.prop('error', S.boolean().required())
		.prop('message', S.string().required())
		.prop('data', S.array().items(data).required())

const userObject = S.object()
	.prop('id', S.number())
	.prop('email', S.string())
	.prop('email_verified', S.boolean())
	.prop('role', S.enum(['customer', 'admin', 'manager']))
	.prop('is_banned', S.boolean())
	.prop('created_at', S.string().format('date'))
	.prop('updated_at', S.string().format('date'))

const emailPassObj = S.object()
	.prop(
		'email',
		S.string().minLength(6).maxLength(100).format('email').required()
	)
	.prop('password', S.string().required())

const s_flush = {
	response: { 200: responseObject() }
}

const productPublicObj = S.object()
	.prop('id', S.number())
	.prop('name', S.string())
	.prop('desc', S.string())
	.prop('slug', S.string().minLength(4).pattern(validate.slug).required())
	.prop('photo', S.string())
	.prop('type', S.enum(['single', 'variable', 'external', 'child']).required())
	.prop('price', S.mixed([S.TYPES.NUMBER, S.TYPES.NULL]))
	.prop('is_published', S.boolean())
	.prop('is_featured', S.boolean())
	.prop('is_available', S.boolean())
	.prop('is_key_reserved', S.boolean().required())
	.prop('parent_id', S.mixed([S.TYPES.NUMBER, S.TYPES.NULL]))
	.prop('external_link', S.string())
	.prop('quantity', S.mixed([S.TYPES.NUMBER, S.TYPES.NULL]))
	.prop('created_at', S.string().format('date'))
	.prop('updated_at', S.string().format('date'))

const s_paginate = row_data =>
	responseObject(
		S.object()
			.prop('total', S.number())
			.prop('per_page', S.number())
			.prop('offset', S.number())
			.prop('to', S.number())
			.prop('last_page', S.number())
			.prop('current_page', S.number())
			.prop('from', S.number())
			.prop('data', S.array().items(row_data))
	)

module.exports = {
	responseObject,
	responseListObject,
	validate,
	userObject,
	emailPassObj,
	productPublicObj,
	s_paginate,
	s_flush
}
