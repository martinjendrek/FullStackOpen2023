const mongoose = require('mongoose')
require('dotenv').config()

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

/* Password is actually not required(anything will match)
It ramains there, if there will be need to hardcode DB url in this file
in case it would be used in other project */
const password = process.argv[2]

const url = process.env.TEST_MONGODB_URI

mongoose.set('strictQuery',false)
mongoose.connect(url)

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog({
    title: "Gudzianowski Chad",
    author: "Mariannaa Bobson",
    url: "www.altenmaria.com",
    likes: 11,
})



blog.save().then(result =>{
  console.log('note saved!')
  mongoose.connection.close()
})


/* 
Blog.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})
 */