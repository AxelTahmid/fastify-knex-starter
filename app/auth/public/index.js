const bcrypt = require('../../../config/plugins/bcrypt')
// const mailer = require('../config/plugins/nodemailer')

const {
	login,
	register,
	me,
	requestOTP,
	verifyEmail,
	resetPassword
} = require('./auth.handlers')
const {
	loginSchema,
	registerSchema,
	meSchema,
	verifyEmailSchema,
	requestOTPSchema,
	resetPasswordSchema
} = require('./auth.schemas')

module.exports = async function (fastify) {
	fastify.register(bcrypt)

	/*
  fastify.register(mailer, {
    defaults: {
      // set the default sender email address to jane.doe@example.tld
      from: process.env.DEFAULT_MAILER_FROM,
      // set the default email subject to 'default example'
      subject: process.env.DEFAULT_MAILER_SUBJECT
    },
    namespace: 'jane',
    transport: {
      host: process.env.MAILER_HOST,
      port: process.env.MAILER_PORT || 465,
      secure: true, // use TLS
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASSWORD
      }
    }
  })
  */

	fastify.route({
		method: 'POST',
		url: '/register',
		schema: registerSchema,
		handler: register
	})

	fastify.route({
		method: 'POST',
		url: '/login',
		schema: loginSchema,
		handler: login
	})

	fastify.route({
		method: 'GET',
		url: '/me',
		onRequest: fastify.auth.verified,
		schema: meSchema,
		handler: me
	})

	fastify.route({
		method: 'POST',
		url: '/otp-code',
		onRequest: fastify.authenticate,
		schema: requestOTPSchema,
		handler: requestOTP
	})

	fastify.route({
		method: 'POST',
		url: '/verify-email',
		onRequest: fastify.authenticate,
		schema: verifyEmailSchema,
		handler: verifyEmail
	})

	fastify.route({
		method: 'POST',
		url: '/reset-password',
		schema: resetPasswordSchema,
		handler: resetPassword
	})
}
