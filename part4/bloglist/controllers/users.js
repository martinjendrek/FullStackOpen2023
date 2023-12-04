const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response,) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body
  //check if passowrd has minimal length
  if (password.length <= 2) {
    return response.status(400).json({ 
      error: 'Password shold have min 3 characters' 
    })
  }

  //hash password using bcrypt library
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  try {
    const user = new User({
      username,
      name,
      passwordHash
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    // Pass any errors to the errorHandler middleware
    next(error)
  }
})

module.exports = usersRouter