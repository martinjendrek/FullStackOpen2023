import '../styles/Blog.css'
import React, { useState } from 'react'


const Blog = ({ blog, updateBlogLikes }) => {
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

  return (
    <div className='blog'>
      {blog.title} {blog.author} {renderToggleButton()}
      {visible && (
        <>
          <br />
          {blog.url} <br />
          {blog.likes} <button onClick={likeButtonOnClick}>like</button><br />
          {blog.user ? blog.user.name : 'Unknown User'} <br />
        </>
      )}
    </div>
  )
}

export default Blog