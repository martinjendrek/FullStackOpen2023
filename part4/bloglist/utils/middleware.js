const logger = require('./logger')
const jwt = require('jsonwebtoken')

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: error.message })
  }
  next(error)
}
/**
 * Middleware to extract a JWT token from the Authorization header.
 * If a valid-looking token is found, it is added to the request object as request.token.
 * Note: This middleware does not perform token validation.
 * @param {object} request - Express request object.
 * @param {object} response - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {void}
 */
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }
  next()
}


module.exports = {
    unknownEndpoint,
    errorHandler,
    tokenExtractor
  }