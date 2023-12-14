import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import CreateNewBlogForm from './components/CreateNewBlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])
  /*
  Get user = {token, username, name} from localstorege, if exist
  */
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])
  /*
  Make POST request to api/login with object {username password}, if succesfull:
  user = {token, username, name} is returned
  */
  const handleLogin = (event) => {
    event.preventDefault()
    console.log('logging in')
    loginService.login({
        username, password,
      }).then(user  => {
        setUser(user)
        setUsername('')
        setPassword('')
        blogService.setToken(user.token)
        window.localStorage.setItem(
          'loggedBlogappUser', JSON.stringify(user)
        )
        setSuccessMessage(`Log in succesfully`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000) 
      })
      .catch(exception => {
        setErrorMessage('Wrong credentials');
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000)
      })
  }
  
  const handleLogout = () => {
    console.log('logging out')
    setUser(null)
    setUsername('')
    setPassword('')
    setNewBlog({ title: '', author: '', url: '' })
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const handleBlogCreate = (event) => {
    event.preventDefault()
    console.log('Adding blog ')
    blogService.create(newBlog).then(() => {
      setSuccessMessage(`A new blog ${newBlog.title} by ${newBlog.author} added`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      setNewBlog({ title: '', author: '', url: '' })
      setShowCreateForm(!showCreateForm)
      blogService.getAll().then((updatedBlogs) => {
        setBlogs(updatedBlogs)
      })
    }
    )
    
  }
  
  const loginForm = () =>(
    <div>
      <h2> Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )

  const blogForm = () => (
    <div>
      <h2>Blogs</h2>
      <p>{user.username} is logged in<button onClick={handleLogout}>logout</button></p>
      {/* Show form based on state */}
      {showCreateForm && (
        <CreateNewBlogForm handleBlogCreate={handleBlogCreate} newBlog={newBlog} setNewBlog={setNewBlog} />
      )}
      {/* Button to toggle form visibility */}
      <button onClick={() => setShowCreateForm(!showCreateForm)}>
        {showCreateForm ? 'Cancel' : 'New blog'}
      </button>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  return (
    <div>

      <Notification message={errorMessage} type={'error'} />
      <Notification message={successMessage} type={'success'} />
      {user === null ? loginForm() : blogForm()}
      
    </div>
  )
}

export default App