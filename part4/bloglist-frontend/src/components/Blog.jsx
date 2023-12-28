import '../styles/Blog.css'
import React, { useState } from 'react'


const Blog = ({ blog, updateBlogLikes, handleBlogRemove, user }) => {
  const [visible, setVisible] = useState(false)
  
  const renderToggleButton = () => (
    <button onClick={() => setVisible(!visible)}>
      {visible ? 'Hide' : 'Show'}
    </button>
  )
  
  const likeButtonOnClick = () => {
    const updatedObject = { ...blog, likes: blog.likes + 1 }
    updateBlogLikes(blog.id, updatedObject)
  }

  const removeButtonOnClick = () =>{
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author} ?`)) {
      handleBlogRemove(blog.id)
    }
  }

  const removeButton = () => (
    <button onClick={removeButtonOnClick} style={{ backgroundColor: 'blue', color: 'white' }}>remove</button>
  )

  return (
    <div className='blog'>
      {blog.title} {blog.author} {renderToggleButton()}
      {visible && (
        <>
          <br />
          {blog.url} <br />
          {blog.likes} <button onClick={likeButtonOnClick}>like</button><br />
          {blog.user ? blog.user.name : 'Unknown User'} {(blog.user && blog.user.username === user.username) ? removeButton() : ''}
          
        </>
      )}
    </div>
  )
}

export default Blog