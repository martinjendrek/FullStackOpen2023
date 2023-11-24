const _ = require('lodash')
const dummy = (blogs) => 1

const totalLikes = (listOfBlogs) => {
    return listOfBlogs.reduce((total, blog) => total + blog.likes, 0);
}

const favoriteBlog = (listOfBlogs) => {
    if (listOfBlogs.length === 0) {
      return null; // Return null for an empty list
    }
    const likesList = listOfBlogs.map(blog => blog.likes);
    const maxLikes = Math.max(...likesList);
  
    return listOfBlogs.find(blog => blog.likes === maxLikes);
  };
  
/*
Create object like {author: no of blogs written by author, ...}
Convert authorCounts object to an array of key-value pairs,
Find the pair with the maximum count
Extract the author and count from the pair
*/

const mostBlogs = (listOfBlogs) => {
  const authorCounts = _.countBy(listOfBlogs, 'author')
  const authorPairs = _.toPairs(authorCounts)
  const topAuthorPair = _.maxBy(authorPairs, (pair) => pair[1])   
  const [author, count] = topAuthorPair || [null, 0]
  return { author:author, blogs: count }
  } 

/*
Groups author and assign array of blogs written by
Sums total likes that one author received
Convert authorTotalLikes object to an array of key-value pairs,
Find the pair with the maximum count
Extract the author and count from the pair
*/
const mostLikes = (listOfBlogs) => {
  const authorLikes = _.groupBy(listOfBlogs, 'author')
  const authorTotalLikes = _.mapValues(authorLikes, (authorBlogs) => _.sumBy(authorBlogs, 'likes'))
  const authorPairs = _.toPairs(authorTotalLikes)
  const topAuthorPair = _.maxBy(authorPairs, (pair) => pair[1]) 
  const [author, count] = topAuthorPair || [null, 0]
  return { author:author, likes: count }
  } 
  

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}