const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response,) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const { title, url } = request.body;
  if (!title || !url) {
    return response.status(400).json({ error: 'Title and url are required' });
  }
  const blog = new Blog(request.body)
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  console.log('body:', body)
  // FindByIdAndUpdate function receives 3 args:
  // 1.ID = request.params.id 2.Content to update 3.Options  
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes: body.likes },
    { new: true, runValidators: true }
  )
  console.log(updatedBlog)
  if (!updatedBlog) {
    return response.status(404).json({ error: 'Blog not found' });
  }
  response.status(200).json(updatedBlog)
})

module.exports = blogsRouter