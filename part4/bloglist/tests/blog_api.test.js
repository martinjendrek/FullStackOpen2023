const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

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
describe('When there is initially some blogs saved', () => {
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
  
    test('blogs have \'id\' property', async () => {
      const response = await api.get('/api/blogs')
      .expect(200)
      response.body.forEach(blog => {
        expect(blog.id).toBeDefined();
      });
      // console.log(response.body, response.type) 
    })
  })
  
  describe('POST test', () => {
    test('Blog is created(201), json is returned', async () => {
      const initialBlogs = await Blog.find({})
      const newBlog = 
        {
          title: "Poradnik mechanika",
          author: "Andrzej Mechanik",
          url: "www.pormech.pl",
          likes: 5,
        }
      const user = await User.findOne({})
      const userForToken = {
        username: user.username, 
        id: user.id
      }
      const token = jwt.sign(userForToken, process.env.SECRET)

      const response = await api.post('/api/blogs')
        .set({ 'Authorization': `Bearer ${token}` })  
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
        // console.log(response.body, response.type)
      // Verify that the total number of blogs is increased by one
      const updatedBlogs = await Blog.find({})
      expect(updatedBlogs).toHaveLength(initialBlogs.length + 1)
      // Verify that the content of the new blog post is saved correctly
      const savedBlog = updatedBlogs.find(blog => blog.id === response.body.id)
      expect(updatedBlogs).toContain(savedBlog)
    }, 10000)
  
    test('Blog with missing likes', async () => {
      const initialBlogs = await Blog.find({});
      const newBlog = 
        {
          title: "Poradnik mechanika",
          author: "Andrzej Mechanik",
          url: "www.pormech.pl"
        }
      const user = await User.findOne({})
      const userForToken = {
          username: user.username, 
          id: user.id
        }
      const token = jwt.sign(userForToken, process.env.SECRET)
      const response = await api.post('/api/blogs')
        .set({ 'Authorization': `Bearer ${token}` })  
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
        // console.log(response.body, response.type)
      // Verify that the total number of blogs is increased by one
      const updatedBlogs = await Blog.find({})
      const savedBlog = updatedBlogs.find(blog => blog.id === response.body.id)
      // console.log(savedBlog.likes, expect.objectContaining(newBlog))
      expect(savedBlog.likes).toEqual(0)
    }, 10000)
  })
})

describe ('When there is initialy one user in DB', () => {
  beforeEach(async () =>{
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name:'initName', passwordHash: passwordHash })
    await user.save()
  })
  
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'martin',
      name: 'martin kjendrek',
      password: 'kojotdzikizwierz',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await User.find({})
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await User.find({})
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(async () =>{
  await mongoose.connection.close()
})