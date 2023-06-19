import axios from 'axios'

// API call

// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
// https://api.openweathermap.org/data/2.5/weather?lat=57&lon=-2.15&appid={API key}&units=metric
// Parameters
// lat, lon:	required geographical coordinates (latitude, longitude). 
// appid	required.	Use unique API key.
// units	optional	

// App start-up:
// APIkey : ($env:REACT_APP_API_KEY="t0p53cr3t4p1k3yv4lu3") -and (npm start) // For Windows PowerShell
// set "REACT_APP_API_KEY=t0p53cr3t4p1k3yv4lu3" && npm start // For Windows cmd.exe

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?'

const api_key = process.env.REACT_APP_API_KEY
const units = 'metric'

/**
 * getWeather takes geographical coordinates (latitude, longitude) as arguments .
 * The return value is promise containg response data
 * @param {number} lat - Number
 * @param {number} lon - Number
 */
const getWeather = (lat, lon) => {
    const request = axios.get(`${baseUrl}lat=${lat}&lon=${lon}&appid=${api_key}&units=${units}`)
    return request.then(response => response.data)
  }
const exportObject = { getWeather }

export default exportObject


