const listHelper = require('../utils/list_helper')

describe('dummy test to learn how to use test', () => {
  test('dummy returns one', () => {
    const blogs = []
  
    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
  })
})