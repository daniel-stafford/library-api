import request from 'supertest'
import { Request, Response, NextFunction } from 'express'

import { BookDocument } from '../../src/models/Book'
import app from '../../src/app'
import * as dbHelper from '../db-helper'

const nonExistingAuthorIsbn = '5e57b77b5744fa0b461c7906'

jest.mock(
  '../../src/middlewares/authJWT',
  () => (req: Request, res: Response, next: NextFunction) => next()
)

async function createBook(override?: any) {
  let book = {
    authors: [{ firstName: 'Charles', lastName: 'Dickens' }],
    title: 'Tale of Two Cities',
    isbn: 333333323,
  }

  if (override) {
    book = { ...book, ...override }
  }

  return await request(app)
    .post('/api/v1/books')
    .send(book)
}

describe('book controller', () => {
  beforeEach(async () => {
    await dbHelper.connect()
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should create an book', async () => {
    const res = await createBook()
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('_id')
    expect(res.body.title).toBe('Tale of Two Cities')
  })

  it('should not create an book with wrong data', async () => {
    const res = await request(app)
      .post('/api/v1/books')
      .send({
        favoriteFood: 'Pizza',
      })
    expect(res.status).toBe(400)
  })

  it('should get back an existing book when searching by isbn', async () => {
    let res = await createBook()
    expect(res.status).toBe(200)
    const bookId = res.body._id
    res = await request(app).get(`/api/v1/books/${res.body.isbn}`)
    expect(res.body._id).toEqual(bookId)
  })

  it('should not get back a non-existing book', async () => {
    const res = await request(app).get(`/api/v1/books/${nonExistingAuthorIsbn}`)
    expect(res.status).toBe(404)
  })

  it('should get back all books', async () => {
    await createBook({
      firstName: 'John',
      lastName: 'Updike',
    })
    await createBook({
      firstName: 'Tom',
      lastName: 'Clancy',
    })
    const res3 = await request(app).get('/api/v1/books')
    expect(res3.body.length).toEqual(2)
  })

  it('should update an existing book', async () => {
    let res = await createBook()
    expect(res.status).toBe(200)

    const authorId = res.body._id
    const update = {
      title: 'Oliver Twist',
    }

    res = await request(app)
      .put(`/api/v1/books/${authorId}`)
      .send(update)

    expect(res.status).toEqual(200)
    expect(res.body.title).toEqual('Oliver Twist')
  })

  it('should delete an existing book', async () => {
    let res = await createBook()
    expect(res.status).toBe(200)
    const authorId = res.body._id

    res = await request(app).delete(`/api/v1/books/${authorId}`)

    expect(res.status).toEqual(204)

    res = await request(app).get(`/api/v1/books/${authorId}`)
    expect(res.status).toBe(404)
  })
})
