
const CreateNewBlogForm = ({
  handleBlogCreate,
  newBlog,
  setNewBlog
  }) => {
  
   return (
     <div>
       <h2>Create new</h2>
      <form onSubmit={handleBlogCreate}>
        <div>
          title
            <input
            type="text"
            value={newBlog.title}
            name="BlogTitle"
            onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })}
          />
        </div>
        <div>
          author
            <input
            type="text"
            value={newBlog.author}
            name="BlogAuthor"
            onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })}
          />
        </div>
        <div>
          url
            <input
            type="text"
            value={newBlog.url}
            name="BlogUrl"
            onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })}
          />
        </div>
        <button type="submit">create</button>
      </form>
     </div>
   )
 }


export default CreateNewBlogForm