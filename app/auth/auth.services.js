'use strict'

async function createUser(fastify, { request }) {
  try {
    const { email, password } = request.body

    fastify.log.info('here in service')

    var check = await fastify.knex('users').where({ email: email })

    fastify.log.info('check query')
    fastify.log.info(check)
    console.log(check)

    if (check) {
      throw new Error(`User with email: ${email} already exists`)
    }

    // await fastify.knex.insert({ email, password }).into('users')

    const access_token = fastify.jwt.sign({ email: email })

    return { access_token, email }
  } catch (err) {
    fastify.log.error(err)
    return err
  }
}

async function fetchUser(fastify, { request }) {
  try {
    fastify.log.info('here in me service')

    // fastify.knex('users').insert({ email, password })

    return request.user
  } catch (err) {
    return err
  }
}

module.exports = { createUser, fetchUser }
