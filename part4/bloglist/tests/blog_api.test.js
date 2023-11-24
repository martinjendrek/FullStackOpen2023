const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

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