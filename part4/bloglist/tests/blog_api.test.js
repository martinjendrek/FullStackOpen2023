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
    const updatedBlogs = await Blog.find({})
    const savedBlog = updatedBlogs.find(blog => blog.id === response.body.id)
    // console.log(savedBlog.likes, expect.objectContaining(newBlog))
    expect(savedBlog.likes).toEqual(0)
  }, 10000)


  test('Blog with missing title', async () => {
    const initialBlogs = await Blog.find({});
    const newBlog = 
      {
        author: "Andrzej Mechanik",
        url: "www.pormech.pl",
        likes: 5,
      }
    const response = await api.post('/api/blogs')
      .send(newBlog)
      .expect(400)
      // console.log(response.body, response.type)
  }, 10000)

  test('Blog with missing url', async () => {
    const initialBlogs = await Blog.find({});
    const newBlog = 
      {
        title: "Poradnik mechanika",
        author: "Andrzej Mechanik",
        likes: 5,
      }
    const response = await api.post('/api/blogs')
      .send(newBlog)
      .expect(400)
  }, 10000)
})
describe('DELETE test', () => {
  test('Blog is deleted(204)', async () => {
    // Add a blog to be deleted in the test
    const newBlog = {
      title: 'To be deleted',
      author: 'Test Author',
      url: 'https://testblog.com',
      likes: 5
    }
    
    // console.log('Adding blog for deletion:', newBlog)
    const response = await api.post('/api/blogs').send(newBlog)
    const addedBlog = response.body
    // console.log('Added blog:', addedBlog)

    const initialBlogs = await Blog.find({})
    // console.log('Initial blogs:', initialBlogs)
    // console.log('Before delete request');
    // console.log('Blog ID to delete:', addedBlog.id);
    await api.delete(`/api/blogs/${addedBlog.id}`)
      .expect(204);
    // console.log('After delete request');

    const updatedBlogs = await Blog.find({})
    // console.log('Updated blogs:', updatedBlogs)
    expect(updatedBlogs).toHaveLength(initialBlogs.length - 1)
    const deletedBlog = await Blog.findById(addedBlog.id)
    // console.log('Deleted blog:', deletedBlog)
    expect(deletedBlog).toBeNull()
  }, 200000)
})

afterAll(async () =>{
  await mongoose.connection.close()
})