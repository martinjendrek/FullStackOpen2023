import React, { useState } from 'react'
const CreateNewBlogForm = ({ handleBlogCreate }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const handleChange = (target) => {
    setNewBlog({ ...newBlog, [target.name]: target.value })
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    handleBlogCreate(event, newBlog)
    setNewBlog({ title: '', author: '', url: '' })
  }

   return (
     <div>
       <h2>Create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          title
            <input
            type="text"
            value={newBlog.title}
            name="title"
            onChange={({ target }) => handleChange(target)}
          />
        </div>
        <div>
          author
            <input
            type="text"
            value={newBlog.author}
            name="author"
            onChange={({ target }) => handleChange(target)}
          />
        </div>
        <div>
          url
            <input
            type="text"
            value={newBlog.url}
            name="url"
            onChange={({ target }) => handleChange(target)}
          />
        </div>
        <button type="submit">create</button>
      </form>
     </div>
   )
 }


export default CreateNewBlogForm