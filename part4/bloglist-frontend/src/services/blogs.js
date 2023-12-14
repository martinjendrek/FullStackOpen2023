import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

/*
Code snippet from backend project to work with 
POST http://localhost:3003/api/blogs
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyIiwiaWQiOiI2NTZlMThjNDJmNjI0NjE5YjkwNTgwZDAiLCJpYXQiOjE3MDE3Nzk4NjN9.fWrIdFz4uWYmtiwtq3YernBxYSao86rizfeEycL_YAs

{
"title": "xxxasdas John",
"author": "xxxasdas Kowalski",
"url": "xxxasdaas",
"likes": 30
}

*/
const create = newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const request = axios.post(baseUrl, newObject, config)
  return request.then(response => response.data)
}



export default { getAll, setToken, create }