import Author from '../../src/models/Author'
import AuthorService from '../../src/services/author'
import * as dbHelper from '../db-helper'

const nonExistingAuthorId = '5e57b77b5744fa0b461c7906'

async function createAuthor() {
  const author = new Author({
    firstName: 'John',
    lastName: 'Steinbeck',
  })
  return await AuthorService.create(author)
}

describe('author service', () => {
  beforeEach(async () => {
    await dbHelper.connect()
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should create a author', async () => {
    const author = await createAuthor()
    expect(author).toHaveProperty('_id')
    expect(author).toHaveProperty('firstName', 'John')
    expect(author).toHaveProperty('lastName', 'Steinbeck')
  })

  it('should get a author with id', async () => {
    const author = await createAuthor()
    const found = await AuthorService.findById(author._id)
    expect(found.firstName).toEqual(author.firstName)
    expect(found._id).toEqual(author._id)
  })
  it('should not get a non-existing author', async () => {
    expect.assertions(1)
    return AuthorService.findById(nonExistingAuthorId).catch(e => {
      expect(e.message).toMatch(`author ${nonExistingAuthorId} not found`)
    })
  })

  // it('should update an existing author', async () => {
  //   const author = await createAuthor()
  //   const update = {
  //     firstName: 'Ashlee',
  //     lastName: 'Vance',
  //   }
  //   const updated = await AuthorService.update(author._id, update)
  //   expect(updated).toHaveProperty('_id', author._id)
  //   expect(updated).toHaveProperty('firstName', 'Ashlee')
  //   expect(updated).toHaveProperty('lastName', 'Vance')
  // })

  it('should not update a non-existing author', async () => {
    expect.assertions(1)
    const update = {
      firstName: 'Ashlee',
      LastName: 'Vance',
    }
    return AuthorService.update(nonExistingAuthorId, update).catch(e => {
      expect(e.message).toMatch(`Author ${nonExistingAuthorId} not found`)
    })
  })

  it('should delete an existing author', async () => {
    expect.assertions(1)
    const author = await createAuthor()
    await AuthorService.deleteAuthor(author._id)
    return AuthorService.findById(author._id).catch(e => {
      expect(e.message).toBe(`author ${author._id} not found`)
    })
  })
})
