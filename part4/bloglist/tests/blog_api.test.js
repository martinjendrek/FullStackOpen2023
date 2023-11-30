const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: "Poradnik mechanika",
    author: "Andrzej Mechanik",
    url: "www.pormech.pl",
    likes: 5,
  },
  {
    title: "Giełdowy lis",
    author: "Wolf",
    url: "www.glis.pl",
    likes: 10,
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

describe('GET test', () => {
  test('blogs are returned as json', async () => {
    const response = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    // console.log(response.body, response.type)
  })
  afterAll(async () =>{
    await mongoose.connection.close()
  })

  test('blogs have \'id\' property', async () => {
    const response = await api.get('/api/blogs')
    .expect(200)
    response.body.forEach(blog => {
      expect(blog.id).toBeDefined();
    });
    // console.log(response.body, response.type) 
  })
  afterAll(async () =>{
    await mongoose.connection.close()
  })
})

describe('POST test', () => {
  test('Blog is created(201), json is returned', async () => {
    const initialBlogs = await Blog.find({});
    const newBlog = 
      {
        title: "Poradnik mechanika",
        author: "Andrzej Mechanik",
        url: "www.pormech.pl",
        likes: 5,
      }
    const response = await api.post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
      // console.log(response.body, response.type)
    // Verify that the total number of blogs is increased by one
    const updatedBlogs = await Blog.find({})
    expect(updatedBlogs).toHaveLength(initialBlogs.length + 1)
    // Verify that the content of the new blog post is saved correctly
    const savedBlog = updatedBlogs.find(blog => blog.id === response.body.id)
    // console.log(savedBlog, expect.objectContaining(newBlog))
    expect(savedBlog).toEqual(expect.objectContaining(newBlog))
  }, 10000)

  test('Blog with missing likes', async () => {
    const initialBlogs = await Blog.find({});
    const newBlog = 
      {
        title: "Poradnik mechanika",
        author: "Andrzej Mechanik",
        url: "www.pormech.pl"
      }
    const response = await api.post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
      // console.log(response.body, response.type)
    // Verify that the total number of blogs is increased by one
    const updatedBlogs = await Blog.find({})
    const savedBlog = updatedBlogs.find(blog => blog.id === response.body.id)
    console.log(savedBlog.likes, expect.objectContaining(newBlog))
    expect(savedBlog.likes).toEqual(0)
  }, 10000)
})

afterAll(async () =>{
  await mongoose.connection.close()
})