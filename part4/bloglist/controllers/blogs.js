const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response,) => {
  const blogs = await Blog.find({}).populate('user','username name')
  response.json(blogs)
})



blogsRouter.post('/', async (request, response, next) => {
  const { title, author, url, likes } = request.body
  // request.token is provided by middleware tokenExtractor
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' });
    }
    // Fetch any user from the database
    const user = await User.findById(decodedToken.id)
    const blog = new Blog({
      title,
      author,
      url,
      likes,
      user: user._id, // Assign the user ID to the blog's user field
    })
    const savedBlog = await blog.save()
    // Update the user's blogs array to include the new blog
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' })
    }
    // Check if the user making the request is the creator of the blog
    if (decodedToken.id !== blog.user.toString()) {
      return response.status(403).json({ error: 'Forbidden: You are not the creator of this blog' })
    }
    // If the user is the creator, delete the blog
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch(error){
    next(error)
  }
})



module.exports = blogsRouter