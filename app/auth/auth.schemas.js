'use strict'

const S = require('fluent-json-schema')
const { errorSchemas } = require('../common/schema')
// const { EMAIL } = require('../../common/pattern') .pattern('')

const registerBody = S.object()
  .prop('email', S.string().minLength(6).maxLength(100).format('email').required())
  .prop('password', S.string().required())

const registerResponse = S.object().prop('access_token', S.string()).prop('email', S.string())

const registerSchema = {
  body: registerBody,
  response: { 201: registerResponse, ...errorSchemas }
}

const meResponse = S.object().prop('email', S.string()).prop('iat', S.string())

const meSchema = {
  response: { 200: meResponse, ...errorSchemas }
}

module.exports = { registerSchema, meSchema }