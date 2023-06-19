import { useState, useEffect } from 'react';
import countriesService from './services/countries'
import weatherService from './services/weather'

const Filter = ( {filter, filterFunction} ) => (
  <>
  find countries: <input value={filter} onChange={filterFunction} />
  </>
)

const Content = ( { renderStatus, countries, country, clickFunction, weather } ) => {
  switch (renderStatus) {
    case "empty":
        return <p>No results</p>;
    case "result":
      return <Country country={country} weather={weather}/>;
    case "list":
        return <CountryList countries={countries} clickFunction={clickFunction} />;
    case "too many results":
        return <p>Too many results</p>;
    default:
        console.log('renderStatus does not match pattern')
        return null;
  }
}
const CountryList = ( {countries, clickFunction} ) => (
  countries.map(country=><p key={country}> {country} <ShowButton key={country} clickFunction={() =>clickFunction(country)}/> </p>)
)

const ShowButton = ( {clickFunction} ) => {
  return (
  <button  onClick={clickFunction}>show</button>
  )
}

const Country = ( {country, weather} ) => {
  if (country === null) {
    return (<></>)
  } else {
    return (<div>
    <h1>{country.name.common}</h1>
      <p>capital: {country.capital}</p>
      <p>area: {country.area}</p>
    <h5>languages:</h5>
      <ul>
        {Object.values(country.languages).map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>
    <img style={{border: '1px solid'}} src={country.flags.png} alt={country.flags.alt} />
    <Weather country={country} weather={weather} />
  </div>)
  }
}

const Weather = ( {country, weather} ) => {
  if (country === null) {
    return (<></>)
  } else if (weather === null) {
    return (<p>Wating for response from API</p>)
  } else {
  return (
    <div>
      <h2>Weather in {country.capital}</h2>
      <p>Description: {weather.weather[0].description}</p>
      <p>Temperature: {weather.main.temp} Celcius</p>
      <p>Wind: {weather.wind.speed} m/s</p>
      <p>Wind direction: {weather.wind.deg} deg</p>
      <img style={{border: '1px solid rgba(0, 0, 0, 0.1)', background:'lightblue'}}src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
    </div>
  )}
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filtredCountries, setFiltredCountries] = useState([])
  const [newFilterName, setFilterName] = useState('')
  const [renderStatus, setRenderStatus] = useState('too many results')
  const [country, setCountry] = useState(null)
  const [weather, setWeather] = useState(null)
  //fetching initial state of Countries state
  useEffect(() => {
    const eventHandler = responseInitialCountries => {
      const countrylist = responseInitialCountries.map(c=>c.name.common)
      setCountries(countrylist)
    }
    countriesService.getAll()
      .then(eventHandler)
  }, [])

  useEffect(() => {
    const findIfIncludes = (p) => p.toLowerCase().includes(newFilterName.toLowerCase())
    setFiltredCountries(countries.filter(findIfIncludes))
  }, [newFilterName])

  useEffect( ()=> {
    if ((filtredCountries.length) === 0) {
      setRenderStatus('empty')
    } else if ((filtredCountries.length) === 1) {
      const eventHandler = responseCountry => {
        setCountry(responseCountry)
      }
      countriesService.getOne(filtredCountries[0])
        .then(eventHandler)
      setRenderStatus('result')
    }else if ((filtredCountries.length) <= 10) {
      setRenderStatus('list')
    } else {
      setRenderStatus('too many results')
    }
      
    }, [filtredCountries])
  useEffect ( () => {
    if (country === null) {
      return;
    } else{
    const eventHandler = responseWeather => {
      setWeather(responseWeather)
    }
    const latlng = country.capitalInfo.latlng
    const lat = latlng[0] 
    const lon = latlng[1] 
    weatherService.getWeather(lat,lon).then(eventHandler)
    }
  }, [country])
  // Functions responsible for handling onChange for text field
  const handleFilterNameChange = (event) => {
    setFilterName(event.target.value)
  }
  // Function to change find field value to name of clicked country 
  const handleShowClick = (clickedCountry) => {
    setFilterName(clickedCountry)
  }
  
  return (
    <div>
      <h1>Data for countries</h1>
      <Filter filter={newFilterName} filterFunction={handleFilterNameChange}/>
      <br></br>
      <Content 
      renderStatus={renderStatus} 
      countries={filtredCountries} 
      country={country}
      clickFunction={handleShowClick}
      weather={weather}/>
    </div>
  )
}

export default App
