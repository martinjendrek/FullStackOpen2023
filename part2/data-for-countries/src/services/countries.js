import axios from 'axios'

// RESTful API documentation:
// https://studies.cs.helsinki.fi/restcountries/

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

const getAll = () => {
  const request = axios.get(`${baseUrl}/all`)
  return request.then(response => response.data)
}

const getOne = (name) => {
  const request = axios.get(`${baseUrl}/name/${name}`)
  return request.then(response => response.data)
}
 

const exportObject = { getAll, getOne }

export default exportObject
