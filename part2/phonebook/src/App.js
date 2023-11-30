import { useState, useEffect  } from 'react'
import phoneService from './services/phones'

const Position = ( {name, number, personid, deleteFunction } ) => {
  
  return <p>{name} {number} <button onClick={() => deleteFunction(name, personid)}>delete</button></p>
}
const Content = ( { persons, deleteFunction } ) => 
  <>
    {persons.map(person =>
      <Position key={person.id} name={person.name} number={person.number} personid={person.id} deleteFunction={deleteFunction}/>
      )
    }
  </>
const Filter = ( {filter, filterFunction} ) => (
  <>
  filter shown with: <input value={filter} onChange={filterFunction} />
  </>
)
const PersonForm = ( {nameValue, nameFunction, numberValue, numberFunction, onSubmitFunction} ) =>(
    <form onSubmit={onSubmitFunction}>
        <div>
          name: <input value={nameValue} onChange={nameFunction} />
        </div>
        <div>
          number: <input value={numberValue} onChange={numberFunction} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
)

const Notification = ( { message } ) => {
  
  if (message === null) {
    return null
  }
  const style = message.toLowerCase().includes("error") ? "error" : "success";
  return (
    <div className={style}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [filteredPersons, setFilteredPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilterName, setFilterName] = useState('')
  const [addMessage, setAddMessage] = useState(null)
  //fetching initial state of persons state
  useEffect(() => {
    const eventHandler = responseInitialPersons => {
      setPersons(responseInitialPersons)
    }
    phoneService.getAll()
      .then(eventHandler)
  }, [])
  // Set of functions, responsible for handling onChange for text field
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterNameChange = (event) => {
    setFilterName(event.target.value)
  }
  // refreshing page after change filterdata or any position in phonebook
  useEffect(() => {
      const findIfIncludes = (p) => p.name.toLowerCase().includes(newFilterName.toLowerCase())
      setFilteredPersons(persons.filter(findIfIncludes))
    }, [newFilterName, persons])
  
  const addPosition = (event) => {
    event.preventDefault()
    const position = {
      name: newName,
      number: newNumber,
    }
    //callback function, to avoid duplicate names
    const findIfExist = p => p.name === newName 
    const duplicatedItem = persons.find(findIfExist) 
    if (duplicatedItem) {
      if (window.confirm(`${newName} is already added to phonebook,
      replace the old number with the new one?`)){
        //---------------------------------------------------------------------
        // PUT request to replace position
        phoneService.update(duplicatedItem.id, position)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== duplicatedItem.id ? person : returnedPerson))
          setNewName('')
          setNewNumber('')
          setAddMessage(`${newName} phonenumber changed succesfully`)
          setTimeout( () => setAddMessage(null), 3000)
        })
        .catch(error => {
          setAddMessage(`error: ${error.response.data.error}`)
          setTimeout( () => setAddMessage(null), 3000)
        })
      } else {console.log('window confirmation canceled')}
      return;
    }
    //---------------------------------------------------------------------
    // POST request if position (based on casesensetive name only) doesn't exist
    phoneService
      .create(position)
      .then(responsePerson => {
        setPersons(persons.concat(responsePerson))
        setNewName('')
        setNewNumber('')
        setAddMessage(`${newName} phonenumber added succesfully`)
        setTimeout( () => setAddMessage(null), 3000)
      })
      .catch(error => {
        setAddMessage(`error: ${error.response.data.error}`)
        setTimeout( () => setAddMessage(null), 3000)
      })
  }
    //---------------------------------------------------------------------
    // DELETE request. 
    // Function deleteFunction is passed as props through App->Content--(map)--->Position
    // so it is available to call for every Position in book
  const deleteFunction = (name,personid) => {
    if (window.confirm(`Delete ${name}?`)) {
      phoneService.deleteposition(personid)
      .then(response => {
        setPersons(persons.filter(p => personid !== p.id))
        setAddMessage(`${name} phonenumber deleted succesfully`)
        setTimeout( () => setAddMessage(null), 3000)
      })
      .catch(error => {
        setAddMessage(`ERROR: ${name} phonenumber has already been removed from server`)
        setTimeout( () => setAddMessage(null), 3000)
      })
    }
}
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={addMessage}/>
      <Filter filter={newFilterName} filterFunction={handleFilterNameChange}/>
      <h3>Add a new</h3>
      <PersonForm 
      nameValue={newName} nameFunction={handleNameChange} 
      numberValue={newNumber} numberFunction={handleNumberChange} 
      onSubmitFunction={addPosition}/>
      <h3>Numbers</h3>
      <Content persons={filteredPersons} deleteFunction={deleteFunction}/>
    </div>
  )
}

export default App